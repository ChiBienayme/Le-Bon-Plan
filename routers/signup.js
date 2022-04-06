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

router.get("/", (_req, res) => {
  res.render("signup");
});

// ! Routes
// TODO Signup: name, email, password
router.get("/signup", (_req, res) => {
    res.render("signup");
  });

router.post("/", async (req, res) => {
  // 1 - Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  // 2 - Créer un utilisateur
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
  } catch (err) {
    return res.status(400).json({
      message: "This account already exists",
    });
  }
   
//   res.status(400).json({
//     message: `Account ${req.body.email} is created`,
//   });

  res.render("profile", {
    isSignedUp: true,
  });

    // res.redirect("/profile");
});

module.exports = router;