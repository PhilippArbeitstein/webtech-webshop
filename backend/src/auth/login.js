const express = require('express');
const router = express.Router();

const pool = require('../pool');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ error: 'Email and password are required.' });
    }

    try {
        const query = `SELECT * FROM users WHERE email = $1 AND password = $2`;
        const result = await pool.query(query, [email, password]);

        if (result.rows.length === 0) {
            return res
                .status(400)
                .json({ error: 'Invalid email or password.' });
        }

        const user = result.rows[0];

        req.session.isAuth = true;
        req.session.email = email;

        res.status(200).json({
            message: 'Login successful',
            id: user.user_id
        });
    } catch (error) {
        console.error('Error accessing the database:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/session', (req, res) => {
    if (req.session.isAuth) {
        return res.status(200).json({
            loggedIn: true,
            email: req.session.email
        });
    }
    res.status(401).json({ loggedIn: false });
});

module.exports = router;
