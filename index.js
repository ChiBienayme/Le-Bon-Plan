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

// Connexion à MongoDB
mongoose
  .connect(
    "mongodb+srv://chibienayme:UCPC3bbpkpuoROqt@cluster0.pg9q2.mongodb.net/lebonplan?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
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
		 email: req.body.email,
		 password: hashedPassword,
	   });
	 } catch (err) {
	   return res.status(400).json({
		 message: "This account already exists",
	   });
	 }
   
	 res.status(201).json({
	   message: `User ${req.body.email} created`,
	 });
	res.redirect("/profile");
});



// TODO Profile
app.get("/profile", async (req, res) => {
	const token = req.cookies.jwt; // eyJfvdfhv5656fvdxfsd
	const userId = 23;

	if (!token) {
		return res.redirect("/");
	}

	const userData = await User.findById(userId);
	

	res.render("profile", {
		// name: userData.name,
		
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