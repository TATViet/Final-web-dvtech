const express = require("express");

const mongoose = require("mongoose");
const passport = require("passport");
const path = require('path');
const bodyParser = require("body-parser");
const session = require("express-session");
const port = process.env.PORT || 3000;
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://TracViet:Vietk12+@atlascluster.3tjpvpi.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster', { useNewUrlParser: true, useUnifiedTopology: true });


// Middleware setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ 
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

// Passport configuration
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/cart"));

// Server setup


app.listen(port, function () {
    console.log("Server Has Started!");
    console.log("http://localhost:3000");
});

