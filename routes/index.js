const express = require("express");
const router = express.Router();

// Showing home page
router.get("/", function (req, res) {
    res.render("home");
});

module.exports = router;