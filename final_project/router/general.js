const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

// User registration
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  users.push({ username, password });

  return res.status(201).json({ message: 'User created successfully.' });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  const book = books.find((book) => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.status(200).json({ book: book });
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;

  const filteredBooks = books.filter((book) =>
    book.authors.includes(author.toLowerCase())
  );

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: 'Books not found.' });
  }

  return res.status(200).json({ books: filteredBooks });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: 'Books not found.' });
  }

  return res.status(200).json({ books: filteredBooks });
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;

  const book = books.find((book) => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  if (!book.review) {
    return res.status(404).json({ message: 'No review found for this book.' });
  }

  return res.status(200).json({ review: book.review });
});

module.exports = public_users;

