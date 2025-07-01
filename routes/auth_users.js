const express = require("express");
const jwt = require("jsonwebtoken");
const auth_users = express.Router();
let books = require("../booksdb.js").books;

let users = [];

function isValid(username) {
  return !users.find(user => user.username === username);
}

auth_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  if (!isValid(username)) return res.status(409).json({ message: "Username already exists" });

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

auth_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, "access", { expiresIn: "1h" });
  req.session.accessToken = token;
  return res.status(200).json({ message: "Login successful", token });
});

auth_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated" });
});

auth_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (books[isbn]?.reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports = auth_users;
