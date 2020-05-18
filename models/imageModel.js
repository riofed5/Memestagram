'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

//Query get all posts information from database
const getAllImages = async (params) => {
    try {
        const [rows] = await promisePool.query('SELECT p.*, u.name as ownername, count(DISTINCT l.ownerid) as likes, IF(EXISTS(SELECT * FROM like_of_post WHERE like_of_post.ownerid=? AND like_of_post.id = p.post_id),1,0) as isLiked, count(DISTINCT c.id) as comments FROM post p LEFT OUTER JOIN like_of_post l ON l.id= p.post_id JOIN user_info u ON p.ownerid=u.user_id LEFT OUTER JOIN comment c ON c.postid=p.post_id GROUP BY p.post_id ORDER BY p.post_id DESC;',
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

//Query get a specific post from database
const getImage = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT post.*, user_info.name as ownername FROM post JOIN user_info ON user_info.user_id = post.ownerid WHERE post_id = ? ORDER BY `post_id` DESC;',
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

//Query get all posts of a specific user using user id from database
const getImageByUser = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT p.*, u.name as ownername, count(DISTINCT l.ownerid) as likes, IF(EXISTS(SELECT * FROM like_of_post WHERE like_of_post.ownerid=? AND like_of_post.id = p.post_id),1,0) as isLiked, count(DISTINCT c.id) as comments FROM post p LEFT OUTER JOIN like_of_post l ON l.id= p.post_id JOIN user_info u ON p.ownerid=u.user_id LEFT OUTER JOIN comment c ON c.postid=p.post_id WHERE u.user_id=? GROUP BY p.post_id ORDER BY p.post_id DESC;',
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

//Query get all posts of a specific user using user name from database
const getImageByUserName = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            "SELECT p.*, u.name as ownername, count(DISTINCT l.ownerid) as likes, IF(EXISTS(SELECT * FROM like_of_post WHERE like_of_post.ownerid=? AND like_of_post.id = p.post_id),1,0) as isLiked, count(DISTINCT c.id) as comments FROM post p LEFT OUTER JOIN like_of_post l ON l.id= p.post_id JOIN user_info u ON p.ownerid=u.user_id LEFT OUTER JOIN comment c ON c.postid=p.post_id WHERE u.name=? GROUP BY p.post_id ORDER BY p.post_id DESC;",
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

//Query add a post to `post` table in database
const addImage = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'INSERT INTO post (description, ownerid, filename, privacy) VALUES (?, ?, ?, ?);',
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

//Query delete a post to `post` table in database
const deleteImage = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'DELETE FROM post WHERE post.post_id = ?;',
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

module.exports = {
    getAllImages,
    getImage,
    addImage,
    deleteImage,
    getImageByUser,
    getImageByUserName
};
