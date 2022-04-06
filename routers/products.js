const express = require("express");
const app = express();
const router = express.Router();


// Middlewares
app.use(express.json());

// ! Routes
// TODO Products
router.get("/", (req, res) => {
    res.render("products");
  });

module.exports = router;