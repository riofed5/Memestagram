'use strict';
const express = require('express');
const imageRoute = require('./routes/imageRoute');
const userRoute = require('./routes/userRoute');
const loginRoute = require('./routes/authRoute');
const commentRoute = require('./routes/commentRoute');
const likeRoute = require('./routes/likeRoute');
const cors = require('cors');
const path = require('path');

const app = express();

//Listening Connection
// if (process.env.SERVER === 'dev_localhost') {
//     require('./secure/localhost')(app);
// } else {
//     //Listen connection
//     require('./secure/server')(app);
//     app.listen(3000, () => {
//         console.log("Server is waiting");
//     });
// }

app.listen(3000,()=>{
    console.log("new is waiting")
})

//Extension
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public_html'));

//Serving file in folders
app.use('/uploads', express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails'));

//Using route for get API
app.use('/image', imageRoute);
app.use('/user', userRoute);
app.use('/auth', loginRoute);
app.use('/comment', commentRoute);
app.use('/like', likeRoute);

//Read file HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public_html/homepage.html'));
});

app.get('/personal', (req, res) => {
    res.sendFile(path.join(__dirname + '/public_html/personal.html'));
});

app.get('/visit', (req, res) => {
    res.sendFile(path.join(__dirname + '/public_html/visit.html'));
});