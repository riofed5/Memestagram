const pool = require('../database/db');
const promisePool = pool.promise();

//Query get all comments in a specific post from database
const getCommentByIDpost = async (params) => {
    try {
        const [rows] =
            await promisePool.query('SELECT comment.*, user_info.name as ownername FROM comment JOIN user_info ON user_info.user_id = comment.ownerid WHERE postid=?;',
                params
            );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

//Add value to comment table in database
const addComment = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'INSERT INTO `comment` (`postid`, `ownerid`, `content`) VALUES (?, ?, ?);',
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

module.exports = {
    getCommentByIDpost,
    addComment
};