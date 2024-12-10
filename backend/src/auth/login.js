const express = require("express");
const router = express.Router();

const pool = require("../pool");

router.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const query = `SELECT * FROM users WHERE email=$1 AND password=$2`;
    pool.query(query, [email, password])
        .then((results) => {
            if (results.rows.length === 0) {
                res.status(400).json({ error: "Login failed." });
            }

            const resultRows = results.rows;
            const resultUser = resultRows[0];

            req.session.isAuth = true;
            req.session.username = email;

            res.status(200).json({
                message: "Login successful",
                email: resultUser.email,
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: `Error accessing Database ${error}`,
            });
        });
});

module.exports = router;
