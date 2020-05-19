'use strict';
const url = 'http://localhost:3000'; 
const s3bucketURL = 'link to your own s3 bucket';

// select existing html elements
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

let selectedPost;

//Navigation
const homepage = document.querySelector('nav .nav-left');
homepage.addEventListener('click', () => {
    window.location.replace('/');
});

searchUser.addEventListener('keypress', (e) => {
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

// create image cards
const createImageCards = (images) => {
    // clear ul
    mainPostsDiv.innerHTML = '';
    images.forEach(async (image) => {
        //formatted date time from json timestamp and check grammar
        const countLike = image.likes;
        const countComment = image.comments;
        let likes, comments;

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
        //Create star-the most favorite icon
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
                img.src = s3bucketURL + image.filename;
                img.alt = image.name;
                img.style.width = '700px';
            } else {
                img = document.createElement('video');
                const sourceMP4 = document.createElement("source");
                sourceMP4.type = "video/mp4";
                sourceMP4.src = s3bucketURL + image.filename;
                img.appendChild(sourceMP4);
                img.style.width = '700px';

            }

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

            const ownerPost = document.createElement('h2');
            ownerPost.innerHTML = `${image.ownername}`;

            if (likes == sessionStorage.getItem('mostFavorite')) {
                ownerPost.appendChild(star);
            } else if (likes > sessionStorage.getItem('mostFavorite')) {
                sessionStorage.setItem('mostFavorite', likes);
            }
            if (image.privacy === 'yes') {
                ownerPost.appendChild(pv);
            }

            const div = document.createElement('div');
            div.classList.add('card');
            div.appendChild(ownerPost);
            div.appendChild(img);
            if (sessionStorage.getItem('mainAdmin')) {
                div.appendChild(delButton);
            }

            const infoLike = document.createElement('div');
            infoLike.classList.add('info-like');
            const likeUI = document.createElement('div');
            likeUI.innerHTML = `${likes} ${comments}`;

            if (sessionStorage.getItem('token')) {
                // like selected image
                const likeButton = document.createElement('button');
                likeButton.innerHTML = '<i class="fa fa-heart"></i>';
                likeButton.addEventListener('click', (e) => {
                    likeButtonListener(e, image.post_id, image.likes);
                });
                infoLike.appendChild(likeButton);
                if (image.isLiked > 0) {
                    likeButton.classList.add('liked');
                }
            }

            infoLike.appendChild(likeUI);
            div.appendChild(infoLike);

            // open large image when clicking image
            img.addEventListener('click', () => {
                if (!sessionStorage.getItem('token')) {
                    modalCard.style.display = "none";
                    modalCard.innerHTML = '';
                } else {
                    createModal(image.post_id, image.likes, image.isLiked, image.privacy, image.time, image.comments);
                }
            });
            mainPostsDiv.appendChild(div);
        }
    });
};


// AJAX call

const check = async () => {
    const idLogin = sessionStorage.getItem('token');
    const test = await fetch(url + `/user/${sessionStorage.getItem('search')}`);
    const isUserExist = await test.json();
    if (isUserExist.length === 0) {
        alert('Username is NOT correct!');
    } else {
        const userName = sessionStorage.getItem('search');
        const response = await fetch(url + `/image/username/${idLogin}/${userName}`);
        const searchResult = await response.json();
        if (searchResult.length === 0) {
            alert('User has NOT posted anything! ^-^');
        }
    }
};

const getImage = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ',
            },
        };
        const userName = sessionStorage.getItem('search');
        const idLogin = sessionStorage.getItem('token');
        const response = await fetch(url + `/image/username/${idLogin}/${userName}`, options);
        const images = await response.json();
        createImageCards(images);
        if (window.location.pathname != "/visit") {
            sessionStorage.removeItem('search');
        }
    } catch (e) {
        if (sessionStorage.getItem('search')) {
            console.log('Username is NOT found')
        } else {
            console.log(e.message);
        }
    }
};

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

//Loading page
if (sessionStorage.getItem('search')) {
    check();
    getImage();
    if (window.location.pathname != "/visit") {
        sessionStorage.removeItem('search');
    }
} else {
    alert('You have not search user!');
}

//Log out
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
        // remove token
        sessionStorage.clear();
        alert('You have logged out');
        window.location.replace('/');
    } catch (e) {
        console.log(e.message);
    }
});
