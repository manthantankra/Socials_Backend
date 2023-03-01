const express = require('express');
const { register, login } = require('../controllers/Auth.js');
const router = express.Router();

// router.route('/register').post(register);
router.post('/register', register);
router.post('/login', login);


module.exports = router;