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

// ! Routes
// TODO Homepage
app.get("/", (req, res) => {
	// renvoie un fichier html
	res.render("homepage", {
		isLoggedIn: false,
	});
});

// TODO Login
app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", (req, res) => {
	// créer un utilisateur

	console.log(req.body);

	// créer token
	const token = "eyJqdqsdsqfg";

	res.cookie("jwt", token);

	res.redirect("/profile");
});

// TODO Signup
app.get("/signup", (req, res) => {
	res.render("signup");
});

app.post("/signup", (req, res) => {
	// créer un utilisateur

	console.log(req.body);

	// créer token
	const token = "eyJqdqsdsqfg";

	res.cookie("jwt", token);

	res.redirect("/profile");
});

// TODO Profile
app.get("/profile", async (req, res) => {
	const token = req.cookies.jwt; // eyJfvdfhv5656fvdxfsd
	const userId = 23;

	if (!token) {
		return res.redirect("/");
	}

	// const userData = await User.findById(userId);
	// const userData = await Pool.query("SELECT * FROM users WHERE user_id=$1", [
	// 	userId,
	// ]);

	res.render("profile", {
		// name: userData.name,
		name: "Nicolas",
		email: "nico@gmail.com",
	});
});

// TODO Users
app.get("/users", (req, res) => {
	res.json({
		name: "Jean",
	});
});

// Start server
app.listen(8000, () => console.log("Listening"));