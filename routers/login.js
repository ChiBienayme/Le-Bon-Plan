const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const router = express.Router();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

// Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Middlewares
app.use(cookieParser());
// pour le css et le js dans le html
app.use(express.static(path.join(__dirname, "/public")));
// body du form de login
app.use(express.urlencoded({ extended: true }));

// Models
const User = require("../models/userModel");

// Code serveur
const secret = process.env.SERVER_CODE;

// dotenv
require("dotenv").config();

const { MONGODB_URI, SERVER_CODE } = process.env;

// Connexion à MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

router.get("/", (req, res) => {
  res.render("login");
});

// ! Routes
// TODO Login: email + password
router.get("/", (_req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1 - Vérifier si le compte associé à l'email existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 2 - Comparer le mot de passe au hash qui est dans la DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 3 - Générer un token
    const token = jwt.sign({ id: user._id }, secret);

    // 4 - On met le token dans un cookie
    res.cookie("jwt", token, { httpOnly: true, secure: false });

    // 5 - Envoyer le cookie au name
    res.json({
      message: "You are logged in",
    });

    res.render("profile", {
      isLoggedIn: true,
    });

    res.redirect("/profile");

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "An error happened" });
  }
});

module.exports = router;