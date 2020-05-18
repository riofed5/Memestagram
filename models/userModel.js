'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

//Query get all users' info
const getAllUsers = async () => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM user_info');
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

//Query get all info of a user
const getUser = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT * FROM user_info WHERE name= ?;',
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

//Query add a user when having new regiser
const addUser = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'INSERT INTO user_info (name,email,password) VALUES (?, ?, ?);',
            params
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

//Get the login user info
const getUserLogin = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT * FROM user_info WHERE email = ?;',
            params);
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    addUser,
    getUserLogin
};