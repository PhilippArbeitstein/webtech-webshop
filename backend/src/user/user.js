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

router.put('/update', checkAuth, async (req, res) => {
    const transaction = await pool.connect();

    const {
        user_id,
        email,
        username,
        password,
        address_id,
        city,
        address,
        province
    } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'Invalid user ID.' });
    }

    try {
        await transaction.query('BEGIN');

        if (address_id) {
            const addressFields = [];
            const addressValues = [];
            let addressIndex = 1;

            if (city) {
                addressFields.push(`city=$${addressIndex++}`);
                addressValues.push(city);
            }
            if (address) {
                addressFields.push(`address=$${addressIndex++}`);
                addressValues.push(address);
            }
            if (province) {
                addressFields.push(`province=$${addressIndex++}`);
                addressValues.push(province);
            }

            if (addressFields.length > 0) {
                addressValues.push(address_id);
                const updateAddressQuery = `UPDATE address SET ${addressFields.join(
                    ', '
                )} WHERE address_id=$${addressIndex}`;
                await transaction.query(updateAddressQuery, addressValues);
            }
        } else {
            await transaction.query('ROLLBACK');
            return res.status(403).json('No address_id provided');
        }

        const userFields = [];
        const userValues = [];
        let userIndex = 1;

        if (email) {
            userFields.push(`email=$${userIndex++}`);
            userValues.push(email);
        }
        if (username) {
            userFields.push(`username=$${userIndex++}`);
            userValues.push(username);
        }
        if (password) {
            userFields.push(`password=$${userIndex++}`);
            userValues.push(password);
        }
        if (address_id) {
            userFields.push(`address_id=$${userIndex++}`);
            userValues.push(address_id);
        }

        if (userFields.length > 0) {
            userValues.push(user_id);
            const updateUserQuery = `UPDATE users SET ${userFields.join(
                ', '
            )}, updated_at=NOW() WHERE user_id=$${userIndex}`;
            await transaction.query(updateUserQuery, userValues);
        }

        const updatedUserQuery = `SELECT * FROM users WHERE user_id = $1`;
        const updatedUser = await transaction.query(updatedUserQuery, [
            user_id
        ]);

        await transaction.query('COMMIT');

        res.status(200).json({
            message: 'User and address updated successfully.',
            user: updatedUser.rows[0]
        });
    } catch (error) {
        await transaction.query('ROLLBACK');
        console.error('Error updating user and address:', error);
        res.status(500).json({ error: 'Internal server error.' });
    } finally {
        transaction.release();
    }
});

module.exports = router;
