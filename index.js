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

// Import routers
const users = require("./routers/users.js");
const products = require("./routers/products.js");
const login = require("./routers/login.js");
const signup = require("./routers/signup.js");
const profile = require("./routers/profile.js");
const logout = require("./routers/logout");

// Routes de l'API
app.use("/users", users);
app.use("/profile", profile);
app.use("/login", login);
app.use("/signup", signup);
app.use("/products", products);
app.use("/logout", logout);

// Code serveur
const secret = process.env.SERVER_CODE;

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

// ! Routes
// TODO Homepage

let name = "";

app.get("/", async (req, res) => {
  if (!req.cookies.jwtCookie) {
    // renvoie un fichier html
    return res.render("homepage", { isLoggedIn: false, username: name });
  }

  try {
    jwt.verify(req.cookies.jwtCookie, secret);
  } catch (err) {
    console.log(err);
  }

  // On vérifie que ce token contient bien l'ID d'un utilisateur connecté
  const decoded = jwt.verify(req.cookies.jwtCookie, secret);
  const userId = req.params._id;
  const userData = await User.findById(decoded.userId);

  res.render("homepage", {
    isLoggedIn: false,
    username: userData.name,
  });
});

// Start server
app.listen(process.env.PORT, () => console.log(`Listening on the ${process.env.PORT}`));
