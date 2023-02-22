import express from 'express'
import {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    followUser,
    unfollowUser
} from '../controllers/userController.js';
import authMiddleWare from '../Middleware/authMiddleware.js';


const router = express.Router();

router.get('/', getAllUsers);
router
    .get('/:id', getUser)
    .put('/:id', authMiddleWare, updateUser)
    .delete('/:id', authMiddleWare, deleteUser);


router.put("/follow/:id", authMiddleWare, followUser);
router.put("/unfollow/:id", authMiddleWare, unfollowUser);


export default router;