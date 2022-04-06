const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
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
const User = require("./models/userModel");

// http://www.unit-conversion.info/texttools/random-string-generator/ : 30 characters
const secret = "5uzhJWUDUDHpTCE5Wbl3uv5Svdo3cT";

// dotenv
require("dotenv").config();

const { PORT, MONGODB_URI, API_KEY } = process.env;

// Connexion à MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

// ! Routes
// TODO Homepage
app.get("/", (_req, res) => {
  // renvoie un fichier html
  res.render("homepage", {
    isLoggedIn: false,
  });
});

// TODO Signup: email, password
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
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

  res.render("profile", {
		isSignedUp: false,
	});

  res.redirect("/profile");
});

// TODO Profile
app.get("/profile", async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect("/");
  }

  res.render("profile", {
    name: req.body.name,
    email: req.body.email,
  });
});

// TODO Login: email + password
app.get("/login", (_req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

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
  // res.json({
  //   message: "You are logged in",
  // });

  res.render("profile", {
		isLoggedIn: false,
	});

  res.redirect("/profile");
});

// TODO Users
app.get("/users", (req, res) => {
  res.json({
    name: req.body.name,
  });
});

// Start server
app.listen(process.env.PORT, () => console.log(`Listening on the ${PORT}`));
