const Post = require('../models/posts')
const User = require('../models/users')
const Comment = require('../models/comments')
const Like = require('../models/likes')

const getAllPosts = async (req, res, next) => {
    const savedUser = req.session.currentUser
    const savedTweetData = req.session.tweetData
    
    req.session.currentUser = null
    req.session.tweetData = null

    try {
        const postData = await Post.fetchAllPosts()
        const userData = []
        const tweetData = []
        const currentUser = await User.getUserName(req.session.user.user_id)

        for (const post of postData[0]) {
            const userName = await User.getUserName(post.user_id)
            userData.push(userName[0][0].username)
        }
        

        for (let i = 0; i < postData[0].length; i++) {
        
            const username = userData[i]
            const content = postData[0][i].content
            const user_id = postData[0][i].user_id
            const post_id = postData[0][i].post_id
            const date = new Date(postData[0][i].time_created)
            const formatDate = date.toLocaleString()
            const like_id = await Like.getLikeId(post_id, req.session.user.user_id)
            const isLiked = like_id[0]
            const numLikes = postData[0][i].numLikes

            tweetData.push({ username, content, user_id, post_id, formatDate, isLiked, numLikes })
        
        }


        res.render('home', { tweetData: savedTweetData || tweetData , title: "Home", currentUser: savedUser || currentUser[0][0].username, currentUserId: req.session.user.user_id })
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const getUserPosts = async (req, res, next) => {
    try {
        const id = req.params.id
        const userName = await User.getUserName(id)
        const postData = await Post.fetchUserPosts(id)
        const tweetData = []
        const currentUser = await User.getUserName(req.session.user.user_id)


        for (let i = 0; i < postData[0].length; i++) {
        
            const username = userName[0][0].username
            const content = postData[0][i].content
            const user_id = postData[0][i].user_id
            const post_id = postData[0][i].post_id
            const date = new Date(postData[0][i].time_created)
            const formatDate = date.toLocaleString()
            const like_id = await Like.getLikeId(post_id, req.session.user.user_id)
            const isLiked = like_id[0]
            const numLikes = postData[0][i].numLikes

            tweetData.push({ username, content, user_id, post_id, formatDate, isLiked, numLikes })
        
        }

        res.render("profile", { tweetData: tweetData, title: userName[0][0].username, currentUser: currentUser[0][0].username, currentUserId: req.session.user.user_id, userName: userName[0][0].username });
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const deletePost = async (req, res, next) => {
    const id = req.params.id;
    const user = req.session.user.user_id;
    try {
        await Post.deletePost(id);

        const userName = await User.getUserName(req.session.user.user_id);
        const postData = await Post.fetchUserPosts(req.session.user.user_id);
        const tweetData = [];
        const currentUser = await User.getUserName(req.session.user.user_id);

        for (let i = 0; i < postData[0].length; i++) {
            const username = userName[0][0].username;
            const content = postData[0][i].content;
            const user_id = postData[0][i].user_id;
            const post_id = postData[0][i].post_id;
            const date = new Date(postData[0][i].time_created)
            const formatDate = date.toLocaleString()
            const like_id = await Like.getLikeId(post_id, req.session.user.user_id)
            const isLiked = like_id[0]
            const numLikes = postData[0][i].numLikes

            tweetData.push({ username, content, user_id, post_id, formatDate, isLiked, numLikes })
        }
        
        res.render("profile", { tweetData: tweetData, title: userName[0][0].username, currentUser: currentUser[0][0].username, currentUserId: req.session.user.user_id, userName: userName[0][0].username
        });
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message });
    }
};

const postAddPost = async (req, res, next) => {
    const { user_id } = req.session.user
    const { content } = req.body

    const newPost = new Post(user_id, content)
    try {
        await newPost.save()
        return res.redirect('/twitter/home')
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}


const getEditPost = async (req, res, next) => {
    const post_id = req.params.id
    const previousUrl = req.headers.referer;

    try {
        const content = await Post.getContent(post_id)
        const user_id = await Post.getUserId(post_id)
        const userName = await User.getUserName(user_id[0][0].user_id)

        res.render("edit", { title: 'Edit Post', type: 'post', content: content[0][0].content, id: post_id, username: userName[0][0].username, previousUrl: previousUrl, currentUserId: req.session.user.user_id });
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const postEditPost = async (req, res, next) => {
    const post_id = req.params.id
    let { content } = req.body

    try {
        await Post.updatePost(content, post_id)
        return res.redirect('/twitter/post/' + req.params.id)
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

module.exports = {
    getAllPosts,
    getUserPosts,
    postAddPost,
    deletePost,
    getEditPost,
    postEditPost
}