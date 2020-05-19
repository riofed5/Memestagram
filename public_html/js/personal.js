'use strict';
const url = 'http://localhost:3000'; 

const s3bucketURL = 'link to your own s3 bucket';

// select existing html elements
const main = document.querySelector('main');
const addForm = document.querySelector('#add-image-form');
const ownerPost = document.querySelector('#add-image-form .owner');

// select existing html elements
const mainPostsDiv = document.querySelector('main div');
const personalIcon = document.querySelector('#personal-icon');
const personalOptions = document.querySelector('#personal-options');
const logOut = document.querySelector('#log-out');

//modalImage
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const closeModalImage = document.querySelector('#image-modal a');

//modalAddImageForm
const postImage = document.querySelector('.main-container .container .post-image button');
const closeModaladdForm = document.querySelector('#post-modal a');

//select modal image info
const modalCard = document.querySelector('#image-modal .modal-card');
const searchUser = document.querySelector('nav .nav-middle input');

let selectedPost, mostlike;

// Navigation
const homepage = document.querySelector('nav .nav-left');
homepage.addEventListener('click', () => {
    window.location.replace('/');
});

personalIcon.addEventListener('click', () => {
    personalOptions.classList.toggle('hide');
});

searchUser.addEventListener('keypress', (e) => {
    const key = e.which || e.keyCode;
    if (key === 13) {
        sessionStorage.setItem('search', searchUser.value);
        window.location.replace('/visit');
    }
});

//Preview image before post
const previewImage = () => {

    const previewContainer = document.querySelector('.preview');
    const previewImage = previewContainer.querySelector('img');
    const previewVideo = previewContainer.querySelector('video');

    const inpFile = document.getElementById('inpFile');

    inpFile.addEventListener('change', () => {
        const file = inpFile.files[0];
        if (file) {
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                if (!file.name.includes('.mp4')) {
                    previewVideo.style.display = "none";
                    previewImage.style.display = "flex";
                    previewImage.setAttribute("src", reader.result);
                } else {
                    previewImage.style.display = "none";
                    previewVideo.style.display = "flex";
                    previewVideo.setAttribute("src", reader.result);
                }
            });

            reader.readAsDataURL(file);
        }
    })
};

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
        //const likes = image.likes;
        //Create star-the most favorite, and private icon
        const star = document.createElement('i');
        star.classList.add('fa');
        star.classList.add('fa-star');

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

        if (image.isLiked > 0) {
            likeButton.classList.add('liked');
        }
        const div = document.createElement('div');
        div.classList.add('card');
        div.appendChild(img);
        div.appendChild(infoLike);
        div.appendChild(delButton);

        // open large image when clicking image
        img.addEventListener('click', () => {
            createModal(image.post_id, image.likes, image.isLiked, image.privacy);
        });
        mainPostsDiv.appendChild(div);
    });
};

postImage.addEventListener('click', () => {
    document.querySelector('#post-modal').classList.toggle('hide');
    previewImage();
});

closeModaladdForm.addEventListener('click', (evt) => {
    evt.preventDefault();
    document.querySelector('#post-modal').classList.toggle('hide');
    const inputs = addForm.querySelectorAll('input');
    inputs.forEach(el => {
        el.value = "";
    });
    clearValuePostImageModal();
});


// AJAX call

const getImage = async () => {
    getMostLikes();
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const userID = sessionStorage.getItem('token');
        const response = await fetch(url + `/image/userID/${userID}`, options);
        const images = await response.json();
        console.log('here',images)
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

// submit add image form
addForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const fd = new FormData(addForm);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: fd,
    };
    
    const response = await fetch(url + '/image/upload', fetchOptions);
    const json = await response.json();
    document.querySelector('#post-modal').classList.toggle('hide');
    const inputs = addForm.querySelectorAll('input');
    inputs.forEach(el => {
        el.value = "";
    });
    clearValuePostImageModal();
    window.location.reload();
});

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

if (sessionStorage.getItem('token')) {
    main.classList.toggle('hide');
    //Set Owner for every post
    ownerPost.value = sessionStorage.getItem('token');
    postImage.style.display = "block";
    getImage();
}
