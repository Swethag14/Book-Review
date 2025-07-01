const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");

const public_users = require("./routes/general.js");
const auth_users = require("./routes/auth_users.js");

const app = express();
app.use(bodyParser.json());

app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true,
}));

// Auth middleware for session-protected routes
app.use("/customer/auth/*", (req, res, next) => {
  const token = req.session.accessToken;
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, "access", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
});

// Register route handlers AFTER middleware
app.use("/", public_users);
app.use("/customer", auth_users);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
