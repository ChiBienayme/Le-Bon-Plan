const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();

// Middlewares
app.use(express.json());
app.use(cookieParser());


// ! Routes
// TODO Logout
router.get("/", (_req, res) => {
    res.clearCookie("jwtCookie", { path: "/" }).redirect("/");
  });

module.exports = router;