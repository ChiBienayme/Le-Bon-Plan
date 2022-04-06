const express = require("express");
const handlebars = require("express-handlebars");
const router = express.Router();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();

// Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Middlewares
app.use(cookieParser());

// dotenv
require("dotenv").config();

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

router.get("/", (req, res) => {
  res.render("profile");
});

// ! Routes
// TODO Profile
router.get("/profile", async (req, res) => {
    const token = req.cookies.jwt;
  
    if (!token) {
      return res.redirect("/");
    }
  
    res.render("profile", {
      name: req.body.name,
      email: req.body.email,
    });
});

module.exports = router;