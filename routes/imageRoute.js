'use strict';
// imageRoute
const express = require('express');
const router = express.Router();

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3')
//Config your s3
const s3 = new aws.S3({
    accessKeyId: process.env.accessKeyId /* Your own access key ID */,
    secretAccessKey: process.env.secretAccessKey /* Your own secret access key*/,
    region: process.env.region /*Region of your S3*/
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: `${process.env.bucketName}` /* Name of your bucket*/,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname);
        }
    }),
});

const imageController = require('../controllers/imageController');

router.get('/all/:idLogin', imageController.image_list_get);
router.get('/singlePost/:id', imageController.image_get);
router.get('/userID/:id', imageController.image_get_by_user);
router.get('/username/:idLogin/:username', imageController.image_get_by_username);
router.post('/upload',upload.single('image'), imageController.image_create_post);
router.delete('/delete/:id', imageController.image_delete);


module.exports = router;













