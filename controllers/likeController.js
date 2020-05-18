const likeModel = require('../models/likeModel');

//Like or unlike a post
const image_like_click = async (req, res) => {
    const params = [
        req.params.postId,
        req.params.ownerId
    ];
    const image = await likeModel.likeImage(params);
    await res.json(image);
};

//Get the likes number of a post
const image_get_like = async (req, res) => {
    const params = [req.params.postId];
    const image = await likeModel.getLikeOfPost(params);
    await res.json(image);
};

//Get the posts which have most likes
const most_likes = async (req, res) => {
    const likes = await likeModel.mostLikes();
    res.json(likes);
};

module.exports = {
    image_like_click,
    image_get_like,
    most_likes
}
