const User = require("../models/user.js");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// registering a new user
exports.register = async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const { username } = req.body;

    try {
        const oldUser = await User.findOne({ username });
        if (oldUser) {
            return res.status(400).json("user is already registered");
        }

        const newUser = new User(req.body);
        const user = await newUser.save();
        const token = jwt.sign({
            username: user.username,
            id: user._id
        }, process.env.JWT_KEY, {
            expiresIn: '1h'
        })
        res.status(200).json({
            success: true,
            user,
            token
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// login a user

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });

        if (user) {
            const validity = await bcrypt.compare(password, user.password);

            if (!validity) {
                res.status(400).json("wrong password");
            } else {
                const token = jwt.sign(
                    { username: user.username, id: user._id },
                    process.env.JWT_KEY,
                    { expiresIn: "1h" }
                );
                res.status(200).json({
                    success: true,
                    user,
                    token
                });
            }
        } else {
            res.status(404).json("User not found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
}
