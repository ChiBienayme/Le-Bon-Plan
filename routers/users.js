const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const router = express.Router();

// Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());





// ! Routes
// TODO Users
app.get("/", (req, res) => {
    res.json({
      name: req.body.name,
    });
  });

module.exports = router;