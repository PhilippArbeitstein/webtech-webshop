const express = require('express');
const router = express.Router();

const pool = require('../pool');
const checkAuth = require('../auth/auth.js');

router.get('/self', checkAuth, (req, res) => {
    res.status(200).json({
        message: 'User Routes Work'
    });
});

module.exports = router;
