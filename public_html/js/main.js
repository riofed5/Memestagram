'use strict';

//Create Modal Image/Post
const createModalCard = (el, comment, like, mostLike, isLiked, isPrivate) => {
    //Check type of files
    const textVideo = checkType(el[0].filename);
    const markup = `
        <div class="image-container">
            ${textVideo}
        </div>
        <div class="info">  
            <div class="post-owner">
                ${el[0].ownername}
                <i class="fa fa-star" aria-hidden="true" style="${mostLike ? '' : 'display:none;'}"></i>
                <i class="fa fa-eye-slash" aria-hidden="true" style="${isPrivate === 'yes' ? '' : 'display:none;'}"></i>
            </div>
            <div class="comments desciption">
                <div class="description">
                    <h3>${el[0].ownername}</h3>
                    <span>${el[0].description}</span>
                </div>
                <div id="comment-section">${comment}</div>
            </div>
            <div class="info-like">
                <button class="${isLiked ? 'liked' : ''}">
                    <i class= "fa fa-heart" ></i>
                </button>
                <div>${like} likes</div>
            </div>
            <div class="new-comment">
                <form class="comment-form" id="add-comment-form">
                    <input class="postid" type="text" name="postid" value='${el[0].post_id}' style="display: none;"/>
                    <input class="ownerComment" type="text" name="owner" value='${sessionStorage.getItem('token')}' style="display: none;"/>
                    <input type="text" name="comment" value="" placeholder="Add a comment..." required type="text"/>
                    <button type="submit">Post</button>
                </form>
            </div>
        </div>
    `;
    return markup;
};

//Create large card
const createModal = async (postId, likes, isLiked, isPrivate) => {
    selectedPost = postId;
    //comparision
    const mostFavorite = likes == sessionStorage.getItem('mostFavorite');
    //Get comment of a post by ID
    let listComment = '';
    const comments = await getCommentbyIDpost(selectedPost);

    comments.forEach(comment => {
        const markup = `
                <div>
                    <h3>${comment.ownername}</h3>
                    <span>${comment.content}</span>
                </div>
            `;
        listComment += markup;
    });

    const response = await fetch(url + `/image/singlePost/${postId}`);
    const json = await response.json();
    modalCard.innerHTML = createModalCard(json, listComment, likes, mostFavorite, isLiked, isPrivate);

    const modalLikeButton = document.querySelector('.info .info-like button');

    modalLikeButton.addEventListener('click', (e) => {
        likeButtonListener(e, selectedPost, likes);
    });
    imageModal.classList.toggle('hide');

    postComment();

};
//Like button eventListener

const likeButtonListener = async (e, postId, numLike) => {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
    };
    try {
        const userID = sessionStorage.getItem('token');
        const response = await fetch(url + `/like/${postId}/${userID}`, fetchOptions);
        // const likes = await getLikebyIDpost(postId);
        const cardLikeUI = e.target.parentElement.nextElementSibling;
        cardLikeUI.innerHTML = `${numLike} likes`;
        const cardLikeButton = e.target.parentElement;
        cardLikeButton.classList.toggle('liked');
        getImage();
        if (selectedPost !== undefined) {
            const modalLikeUI = document.querySelector('.info .info-like button + div');
            const likes = await getLikebyIDpost(postId);
            modalLikeUI.innerHTML = `${likes.length} likes`;
        }
    } catch (e) {
        console.log(e.message);
    }
};

// closeModalImage modal
closeModalImage.addEventListener('click', (evt) => {
    evt.preventDefault();
    modalCard.innerHTML = '';
    selectedPost = undefined;
    imageModal.classList.toggle('hide');
});

//Get all the comments
const getCommentbyIDpost = async (id) => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ',
            },
        };
        const response = await fetch(url + `/comment/${id}`, options);
        return await response.json();
    } catch (e) {
        console.log(e.message);
    }
};

//Get the number of likes
const getLikebyIDpost = async (id) => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ',
            },
        };
        const response = await fetch(url + `/like/${id}`, options);
        return await response.json();
    } catch (e) {
        console.log(e.message);
    }
};

//Post comment
const postComment = () => {
    const commentForm = document.querySelector('#add-comment-form');
    //Comment POST method
    if (commentForm) {
        commentForm.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            const data = serializeJson(commentForm);
            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',

                },
                body: JSON.stringify(data),
            };
            const response = await fetch(url + '/comment', fetchOptions);
            const json = await response.json();
            let listComment = '';
            const comments = await getCommentbyIDpost(selectedPost);

            comments.forEach(comment => {
                const markup = `
                    <div>
                        <h3>${comment.ownername}</h3>
                        <span>${comment.content}</span>
                    </div>
                `;
                listComment += markup;
            });
            const commentSection = document.querySelector('.comments #comment-section');
            commentSection.innerHTML = listComment;
            const commentInput = document.querySelector('#add-comment-form input:nth-child(3)');
            commentInput.value = '';
            getImage();
        });
    }
};
//check Video or Image before creating modal image
const checkType = (filename) => {
    if (filename.includes('mp4')) {
        return `<video width="400" height="400"a controls autoplay> <source src="https://memewebmedia.s3.eu-central-1.amazonaws.com/${filename}" type="video/mp4"></video>`;
    } else {
        return `<img alt="" src="https://memewebmedia.s3.eu-central-1.amazonaws.com/${filename}">`;
    }

};
//Clear value of post-image-modal
const clearValuePostImageModal = () => {
    const previewContainer = document.querySelector('.preview');
    const previewImage = previewContainer.querySelector('img');
    const previewVideo = previewContainer.querySelector('video');
    previewImage.setAttribute("src", "");
    previewVideo.setAttribute("src", "");
    previewImage.style.display = "none";
    previewVideo.style.display = "none";
};
