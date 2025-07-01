const express = require("express");
const public_users = express.Router();
const books = require("../booksdb.js").books;

//
// 🔹 Task 1: Get all books
//
public_users.get("/", (req, res) => {
  res.send(JSON.stringify(books, null, 4));
});

//
// 🔹 Task 2: Get book by ISBN
//
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

//
// 🔹 Task 3: Get book by author
//
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );
  if (filteredBooks.length > 0) {
    res.send(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

//
// 🔹 Task 4: Get book by title
//
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );
  if (filteredBooks.length > 0) {
    res.send(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//
// 🔹 Task 5: Get book review by ISBN
//
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

//
// 🔹 Task 10: Async - Get all books
//
public_users.get("/async/books", async (req, res) => {
  try {
    const allBooks = await Promise.resolve(books);
    res.send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

//
// 🔹 Task 11: Async - Get book by ISBN
//
public_users.get("/async/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await Promise.resolve(books[isbn]);
    if (book) {
      res.send(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch {
    res.status(500).json({ message: "Error retrieving book" });
  }
});

//
// 🔹 Task 12: Async - Get books by author
//
public_users.get("/async/author/:author", async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    const filteredBooks = await Promise.resolve(
      Object.values(books).filter(
        (book) => book.author.toLowerCase() === author
      )
    );
    if (filteredBooks.length > 0) {
      res.send(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch {
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});

//
// 🔹 Task 13: Async - Get books by title
//
public_users.get("/async/title/:title", async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    const filteredBooks = await Promise.resolve(
      Object.values(books).filter(
        (book) => book.title.toLowerCase() === title
      )
    );
    if (filteredBooks.length > 0) {
      res.send(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch {
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});

module.exports = public_users;

