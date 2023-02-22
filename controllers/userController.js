import User from "../models/user.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        let users = await User.find({});
        users = users.map((user) => {
            const { password, ...otherDetails } = user._doc
            return otherDetails;
        })
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get a user 

export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (user) {
            // user.password = undefined; // One method to not show the password
            const { password, ...otherDetails } = user._doc; // Another method to hide the password

            res.status(200).json(otherDetails);
        }
        else {
            res.status(404).json({ msg: "user not found" });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

// Update a user 

export const updateUser = async (req, res) => {
    const id = req.params.id;

    const { _id, currentUserAdminStatus, password } = req.body;

    if (id === _id) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, 10);
            }
            const user = await User.findByIdAndUpdate(id, req.body,
                {
                    new: true,
                    runValidators: true
                })

            const token = jwt.sign(
                { username: user.username, id: user._id },
                process.env.JWT_KEY, {
                expiresIn: '1h'
            });

            res.status(200).json({
                success: true,
                user,
                token
            })
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
    else {
        res.status(403).json({
            msg: "Access Denied! you can only update your profile"
        })
    }
}

// Delete a user

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const { _id, currentUserAdminStatus } = req.body;

    if (_id === id || currentUserAdminStatus) {
        try {
            await User.findByIdAndDelete(id);
            res.status(200).json({ success: true, msg: "User deleted successfully" });
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
    else {
        res.status(403).json("Access Denies! you can only delete your own profile");
    }
}

// Follow a user

export const followUser = async (req, res) => {
    const id = req.params.id; // User who should be follow

    const { _id } = req.body; //user who wants to follow 

    if (_id === id) // user can't follow him or herself
    {
        res.status(403).json('Action forbidden');
    }
    else {
        try {
            const followUser = await User.findById(id);
            const followingUser = await User.findById(_id);

            if (!followUser.followers.includes(_id)) {
                await followUser.updateOne({ $push: { followers: _id } });
                await followingUser.updateOne({ $push: { following: id } });
                res.status(200).json('user followed!');
            }
            else {
                res.status(403).json("User is already followed by you");
            }
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

// unfollow a user

export const unfollowUser = async (req, res) => {
    const id = req.params.id; // User who should be follow

    const { _id } = req.body; //user who wants to follow 

    if (_id === id) // user can't follow him or herself
    {
        res.status(403).json('Action forbidden');
    }
    else {
        try {
            const followUser = await User.findById(id);
            const followingUser = await User.findById(_id);

            if (followUser.followers.includes(_id)) {
                await followUser.updateOne({ $pull: { followers: _id } });
                await followingUser.updateOne({ $pull: { following: id } });
                res.status(200).json('user unfollowed!');
            }
            else {
                res.status(403).json("User is not followed by you");
            }
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}