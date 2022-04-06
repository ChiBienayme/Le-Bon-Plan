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

// Models
const User = require("../models/userModel");

// Code serveur
const secret =  process.env.SERVER_CODE;

// dotenv
require("dotenv").config();

const { MONGODB_URI } = process.env;

// Connexion à MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

router.get("/", (req, res) => {
  res.render("signup");
});

// ! Routes
// TODO Profile
router.get("/", async (req, res) => {
    try {
        jwt.verify(req.cookies.jwtCookie, secret);
      } catch (err) {
        console.log(err);
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
    
      if (!req.cookies.jwtCookie) {
        return res.redirect("login");
      }
    
      // On vérifie que ce token contient bien l'ID d'un utilisateur admin
      const decoded = jwt.verify(req.cookies.jwtCookie, secret);
      const userId = req.params._Id;
      const userData = await User.findById(decoded.userId)
      
    
      res.render("profile", { username: userData.name });
    });

module.exports = router;