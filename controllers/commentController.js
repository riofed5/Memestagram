const commentModel = require('../models/commentModel');

//Get all comments in a post
const comment_get = async (req, res) => {
    const params = [req.params.id];
    const comment = await commentModel.getCommentByIDpost(params);
    await res.json(comment);
};

// Add comment to a post
const comment_create_post = async (req, res) => {
    try {
        const params = [
            req.body.postid,
            req.body.owner,
            req.body.comment,
        ];
        const response = await commentModel.addComment(params);
        await res.json(response);

    } catch (e) {
        console.log('exif error here it is');
        res.status(400).json({message: 'error'});
    }

};

module.exports = {
    comment_get,
    comment_create_post
};