const express = require("express");
const router = express.Router();

const pool = require("../pool");
const checkAuth = require("../auth/auth.js");

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Vehicles Routes Work",
    });
});

module.exports = router;
