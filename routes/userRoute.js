const express = require('express');
const authMiddleWare = require('../Middleware/authMiddleware.js');
const {
    getAllUser,
    getUser,
    updateUser,
    deleteUser,
    followUser,
    unfollowUser
} = require('../controllers/userController.js');

const router = express.Router();

router.get('/', getAllUser);

router
    .get('/:id', getUser)
    .put('/:id', authMiddleWare, updateUser)
    .delete('/:id', authMiddleWare, deleteUser);


router.put("/follow/:id", authMiddleWare, followUser);
router.put("/unfollow/:id", authMiddleWare, unfollowUser);

module.exports = router;