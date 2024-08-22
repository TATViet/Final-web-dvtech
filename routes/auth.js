const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

// Showing register form
router.get("/register", function (req, res) {
    res.render("register");
});

// Handling user signup
router.post("/register", async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        IsAD: req.body.IsAD == 'on'
    });
    return res.redirect('/login');
});

// Showing login form
router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", async function(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const result = req.body.password === user.password;
            if (result) {
                req.login(user, function(err) {
                    if (err) {
                        return res.status(400).json({ error: "Error logging in" });
                    }
                    res.redirect(user.IsAD ? "/verysecret" : "/productDetails");
                });
            } else {
                res.render("login");
            }
        } else {
            res.render("login");
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Handling user logout 
router.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;