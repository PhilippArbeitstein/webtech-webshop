const express = require("express");
const router = express.Router();

const pool = require("../pool");
const checkAuth = require("../auth/auth.js");

router.get("/", (req, res) => {
    pool.query("Select * from retail",
        (err, result) => {
            if (err) {
                res.status(500).send("Error creating product")
            } else {
                res.status(201).json(result.rows);
            }
        });
});

module.exports = router;
