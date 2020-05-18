'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

//Query add data to like table
const likeImage = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'INSERT INTO like_of_post (id, ownerid) VALUES (?,?);',
            params
        );
        return rows;
    } catch (e) {
        //a user cannot like a post twice, if they do, adding query will get error -> unlike
        const [rows] = await promisePool.execute(
            'DELETE FROM `like_of_post` WHERE `like_of_post`.`id` = ? AND `like_of_post`.`ownerid` = ?',
            params
        );
        console.log('disliked', e.message);
        return rows;
    }
};

//Query get post with most like
const mostLikes = async () => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT * FROM (SELECT id, COUNT(*) AS likes FROM like_of_post GROUP BY id ) g ORDER BY likes DESC LIMIT 1'
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

//Query get number of likes in a post
const getLikeOfPost = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT * FROM like_of_post WHERE id= ?',
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

module.exports = {
    likeImage,
    getLikeOfPost,
    mostLikes
};