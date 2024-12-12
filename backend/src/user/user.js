const express = require('express');
const router = express.Router();

const pool = require('../pool');
const checkAuth = require('../auth/auth.js');

router.get('/:userId', checkAuth, async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (!userId) {
        return res.status(400).json({ error: 'Invalid user ID.' });
    }

    try {
        const query = `SELECT * FROM users WHERE user_id = $1`;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = result.rows[0];
        res.status(200).json(user);
    } catch (error) {
        console.error('Error accessing the database:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
