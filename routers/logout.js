const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// dotenv
require("dotenv").config();

// ! Routes
// TODO Logout
router.get("/", (req, res) => {
    res.clearCookie("jwtCookie", { path: "/" }).redirect("/");
  });

module.exports = router;