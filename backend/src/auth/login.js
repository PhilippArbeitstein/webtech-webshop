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
        req.session.user_id = user.user_id;
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
            user_id: req.session.user_id
        });
    }
    res.status(401).json({ loggedIn: false });
});

router.post('/register', async (req, res) => {
    try {
        const { address, user } = req.body;

        if (!address || !user) {
            return res
                .status(400)
                .json({ message: 'Address and user details are required' });
        }

        const { city, user_address, province } = address;
        const { email, username, password } = user;

        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res
                .status(400)
                .json({ message: 'Email or Username already registered' });
        }

        const newAddressResult = await pool.query(
            'INSERT INTO address (city, address, province) VALUES ($1, $2, $3) RETURNING address_id',
            [city, user_address, province]
        );
        const addressId = newAddressResult.rows[0].address_id;

        const registerUserResult = await pool.query(
            'INSERT INTO users (email, username, password, address_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, username, password, addressId]
        );
        const newUser = registerUserResult.rows[0];

        req.session.isAuth = true;
        req.session.user_id = newUser.user_id;
        req.session.email = newUser.email;

        res.status(200).json({
            message: 'Registration successful',
            user: {
                id: newUser.user_id,
                email: newUser.email,
                username: newUser.username,
                address_id: newUser.address_id
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
    }
});

module.exports = router;
