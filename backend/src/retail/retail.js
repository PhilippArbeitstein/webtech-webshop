const express = require("express");
const router = express.Router();

const pool = require("../pool");

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Retail Routes Work",
    });
});

module.exports = router;
