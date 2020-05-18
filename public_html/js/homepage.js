'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

console.log(sessionStorage);
// select existing html elements
const loginWrapper = document.querySelector('#auth-wrapper');
const main = document.querySelector('main');
const loginForm = document.querySelector('#login-form');
const addUserForm = document.querySelector('#add-user-form');
const mainPostsDiv = document.querySelector('main div');
const personalIcon = document.querySelector('#personal-icon');
const personalOptions = document.querySelector('#personal-options');
const logOut = document.querySelector('#log-out');

//modalImage
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const closeModalImage = document.querySelector('#image-modal a');

//select modal image info
const modalCard = document.querySelector('#image-modal .modal-card');
const searchUser = document.querySelector('nav .nav-middle input');
let selectedPost, likes;

//Navigation
searchUser.addEventListener('keypress', async (e) => {
    const key = e.which || e.keyCode;
    if (key === 13) {
        sessionStorage.setItem('search', searchUser.value);
        window.location.replace('/visit');
    }
});

personalIcon.addEventListener('click', () => {
    if (sessionStorage.getItem('token')) {
        personalOptions.classList.toggle('hide');
    }
});

const personalPage = document.querySelector('nav .nav-right #personal-page');
personalPage.addEventListener('click', () => {
    window.location.replace('/personal');
});

const loginTitle = document.querySelector('.title #login-title');
const registerTitle = document.querySelector('.title #register-title');
loginTitle.addEventListener('click', () => {
    loginTitle.classList.add('selected-title');
    registerTitle.classList.remove('selected-title');
    loginForm.classList.remove('hide');
    addUserForm.classList.add('hide');
});
registerTitle.addEventListener('click', () => {
    registerTitle.classList.add('selected-title');
    loginTitle.classList.remove('selected-title');
    addUserForm.classList.remove('hide');
    loginForm.classList.add('hide');
});

// create image cards
const createImageCards = (images) => {
    // clear ul
    mainPostsDiv.innerHTML = '';
    images.forEach(async (image) => {
        //Format the json timestamp, check grammar
        const countLike = image.likes;
        const countComment = image.comments;
        let likes,comments;

        switch (countLike) {
            case 0:
                likes = '';
                break;
            case 1:
                likes = countLike + ' like';
                break;
            default:
                likes = countLike + ' likes';
        }
        switch (countComment) {
            case 0:
                comments = '';
                break;
            case 1:
                comments = countComment + ' comment';
                break;
            default:
                comments = countComment + ' comments';
        }
        //const likes = image.likes;
        //Create star-the most favorite, and private icon
        const star = document.createElement('i');
        star.classList.add('fa');
        star.classList.add('fa-star');
      
        const pv = document.createElement('i');
        pv.classList.add('fa');
        pv.classList.add('fa-eye-slash');

        if (image.privacy !== "yes" || (image.privacy === "yes" && sessionStorage.getItem('mainAdmin'))) {

            // create <div> for each image with DOM methods
            let img;
            if (!image.filename.includes('mp4')) {
                img = document.createElement('img');
                img.src = 'https://memewebmedia.s3.eu-central-1.amazonaws.com/' + image.filename;
                img.alt = image.name;
                img.classList.add('resp');
            } else {
                img = document.createElement('video');
                const sourceMP4 = document.createElement("source");
                sourceMP4.type = "video/mp4";
                sourceMP4.src = 'https://memewebmedia.s3.eu-central-1.amazonaws.com/' + image.filename;
                img.appendChild(sourceMP4);
                img.style.height = '400px';
            }

            // like selected image
            const infoLike = document.createElement('div');
            infoLike.classList.add('info-like');

            const likeButton = document.createElement('button');
            likeButton.innerHTML = '<i class="fa fa-heart"></i>';
            likeButton.addEventListener('click', (e) => {
                likeButtonListener(e, image.post_id);
            });

            const likeUI = document.createElement('div');

            likeUI.innerHTML = `${likes} ${comments}`;
            infoLike.appendChild(likeButton);
            infoLike.appendChild(likeUI);

            // delete selected image
            const delButton = document.createElement('button');
            delButton.innerHTML = 'X';
            delButton.classList.add('del-button');
            delButton.addEventListener('click', async () => {
                const fetchOptions = {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                };
                try {
                    const response = await fetch(url + '/image/delete/' + image.post_id, fetchOptions);
                    const json = await response.json();
                    console.log('delete response', json);
                    getImage();
                } catch (e) {
                    console.log(e.message());
                }
            });
            //Check if loged in user liked this post so as to change the like button to red
            if (image.isLiked > 0) {
                likeButton.classList.add('liked');
            }

            const ownerPost = document.createElement('h2');
            ownerPost.innerHTML = `${image.ownername}`;
            if (countLike == sessionStorage.getItem('mostFavorite')) {
                ownerPost.appendChild(star);
            } else if (countLike > sessionStorage.getItem('mostFavorite')) {
                sessionStorage.setItem('mostFavorite', countLike);
            }
            if (image.privacy === 'yes') {
                ownerPost.appendChild(pv);
            }
            if(image.privacy==='yes'){
                ownerPost.appendChild(pv);
            }
            const div = document.createElement('div');
            div.classList.add('card');
            div.appendChild(ownerPost);

            div.appendChild(img);
            div.appendChild(infoLike);
            if (sessionStorage.getItem('mainAdmin')) {
                ownerPost.appendChild(delButton);
            }
            // open large image when clicking image
            img.addEventListener('click', () => {
                createModal(image.post_id, image.likes, image.isLiked, image.privacy);
            });
            mainPostsDiv.appendChild(div);
        }
    });
};

// AJAX call
const getImage = async () => {
    getMostLikes();
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const idLogin = sessionStorage.getItem('token');
        const response = await fetch(url + `/image/${idLogin}`, options);
        const images = await response.json();
        createImageCards(images);
        sessionStorage.removeItem('search');
    } catch (e) {
        console.log(e.message);
    }
};

//Figure out the largest number of likes 
const getMostLikes = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + `/like/top/likes`, options);
        const result = await response.json();
        if (sessionStorage.getItem('token')) {
            sessionStorage.setItem('mostFavorite', result[0].likes);
        }
        return sessionStorage.getItem('mostFavorite');
    } catch (e) {
        console.log(e.message);
    }
};

// login
loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(loginForm);
    //console.log(data);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    try {
        const response = await fetch(url + '/auth/login', fetchOptions);

        const json = await response.json();

        console.log('login response', json);
        if (!json[0].email) {
            alert("Wrong email or password");
            alert(json.message);
        } else {
            console.log('savetoken pending..');
            // save token
            sessionStorage.setItem('token', json[0].user_id);
            console.log('savetoken completed');
            const inputs = loginForm.querySelectorAll('input');
            inputs.forEach(el => {
                el.value = "";
            });
            if (json[0].mainAdmin === "yes") {
                sessionStorage.setItem('mainAdmin', json[0].user_id);
            }
            console.log(sessionStorage);
            loginWrapper.classList.toggle('hide');
            main.classList.toggle('hide');
            alert(`Login successfully! Hello ${json[0].name}`);
            getImage();
        }
    }
    catch (e) {
        alert('Wrong email or password');
    }
});

// logout
logOut.addEventListener('click', async (evt) => {
    evt.preventDefault();
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/auth/logout', options);
        const json = await response.json();
        console.log(json);
        // remove token
        sessionStorage.clear();
        alert('You have logged out');
        // show/hide forms + images
        loginWrapper.classList.toggle('hide');
        main.classList.toggle('hide');
    } catch (e) {
        console.log(e.message);
    }
});

// submit register form
addUserForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(addUserForm);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url + '/auth/register', fetchOptions);
    const json = await response.json();
    console.log('user add response', json);
    // save token
    sessionStorage.setItem('token', json[0].user_id);
    //Clear text in after register
    const inputs= addUserForm.querySelectorAll('input');
    inputs.forEach(el=>{
        el.value="";
    });
    // show/hide forms + images
    loginWrapper.classList.toggle('hide');
    main.classList.toggle('hide');
    alert(`Login successfully! Hello ${json[0].name}`);
    getImage();
});

// when app starts, check if token exists and hide login form, show logout button and main content, get images and users
if (sessionStorage.getItem('token')) {
    loginWrapper.classList.toggle('hide');
    main.classList.toggle('hide');
    getImage();
} else {
    sessionStorage.removeItem('search');
}

