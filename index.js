const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
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


// Import routers
const login = require("./routers/login.js");
const logout = require("./routers/logout");
const products = require("./routers/products.js");
const profile = require("./routers/profile.js");
const signup = require("./routers/signup.js");
const users = require("./routers/users.js");

// Routes de l'API
app.use("/login", login);
app.use("/logout", logout);
app.use("/products", products);
app.use("/profile", profile);
app.use("/signup", signup);
app.use("/users", users);

// ! Routes
// TODO Homepage

app.get("/", async (req, res) => {
res.render("homepage")
});

// Start server
app.listen(process.env.PORT, () => console.log(`Listening on the ${process.env.PORT}`));
