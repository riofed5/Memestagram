'use strict';
// imageRoute
const express = require('express');
const router = express.Router();

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3')

const s3 = new aws.S3({
    accessKeyId: 'AKIAYYN7MMHFFIP3NGPF',
    secretAccessKey: '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',
    region: 'eu-central-1'
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'memewebmedia',
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname);
        }
    }),
});



const imageController = require('../controllers/imageController');

router.get('/:idLogin', imageController.image_list_get);
router.get('/test/:id', imageController.image_get);
router.get('/test/user/:id', imageController.image_get_by_user);
router.get('/test/username/:idLogin/:username', imageController.image_get_by_username);
router.post('/test',upload.single('image'), imageController.image_create_post);
router.delete('/delete/:id', imageController.image_delete);


module.exports = router;

//Prevent files uploaded from having the same name in database
// const storage = multer.diskStorage({
//     destination: './uploads',
//     filename: (req, file, cb) => {
        // cb(null, Date.now() + '_' + file.originalname);
//     }
// });
// const upload= multer({storage: storage});













