const express = require("express");
const {
    createPost,
    getPost,
    updatePost,
    deletePost,
    likePost,
    getTimelinePosts
} = require("../controllers/postController.js");

const router = express.Router();

router.post('/', createPost);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete("/:id", deletePost);
router.put("/like/:id", likePost);
router.get("/timeline/:id", getTimelinePosts);

module.exports = router;