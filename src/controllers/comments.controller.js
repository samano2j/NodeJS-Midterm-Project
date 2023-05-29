const Post = require('../models/posts')
const User = require('../models/users')
const Comment = require('../models/comments')
const Like = require('../models/likes')

const getAllComments = async (req, res, next) => {
    const post_id = req.params.id
    try {
        const commentData = await Comment.fetchAllComments(post_id)
        const comments = []
        const currentUser = await User.getUserName(req.session.user.user_id)
        const userData = []
        const postData = await Post.getPostbyId(post_id)
        const postUser = await User.getUserName(postData[0][0].user_id)
        const date = new Date(postData[0][0].time_created)
        const formatDate = date.toLocaleString()
        const like_id = await Like.getLikeId(post_id, req.session.user.user_id)
        const isLiked = like_id[0]
        
        const post = {
            post_id: postData[0][0].post_id,
            content: postData[0][0].content,
            user_id: postData[0][0].user_id,
            username: postUser[0][0].username,
            formatDate: formatDate,
            isLiked: isLiked,
            numLikes: postData[0][0].numLikes
        } 

        for (const comment of commentData[0]) {
            const userName = await User.getUserName(comment.user_id)
            userData.push(userName[0][0].username)
        }


        for (let i = 0; i < commentData[0].length; i++) {
        
            const username = userData[i]
            const content = commentData[0][i].content
            const user_id = commentData[0][i].user_id
            const post_id = commentData[0][i].post_id
            const comment_id = commentData[0][i].comment_id
            const date = new Date(commentData[0][i].time_created)
            const formatDate = date.toLocaleString()
        
            comments.push({ username, content, user_id, post_id, comment_id, formatDate })
        
        }
        res.render('post', { post: post, comments: comments , title: "Post", currentUser: currentUser[0][0].username, currentUserId: req.session.user.user_id  })

    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const postAddComment = async (req, res, next) => {
    const { user_id } = req.session.user
    const post_id = req.params.id
    const { content } = req.body
    const newComment = new Comment(content, post_id, user_id)
    try {
        await newComment.save()
        return res.redirect('/twitter/post/' + req.params.id)
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const deleteComment = async (req, res, next) => {
    const {post_id, comment_id} = req.params
    try {
        await Comment.deleteComment(comment_id)
        const commentData = await Comment.fetchAllComments(post_id)
        const comments = []
        const currentUser = await User.getUserName(req.session.user.user_id)
        const userData = []
        const postData = await Post.getPostbyId(post_id)
        const postUser = await User.getUserName(postData[0][0].user_id)
        const date = new Date(postData[0][0].time_created)
        const formatDate = date.toLocaleString()
        const like_id = await Like.getLikeId(post_id, req.session.user.user_id)
        const isLiked = like_id[0]
        const post = {
            post_id: postData[0][0].post_id,
            content: postData[0][0].content,
            user_id: postData[0][0].user_id,
            username: postUser[0][0].username,
            formatDate: formatDate,
            isLiked: isLiked,
            numLikes: postData[0][0].numLikes
        } 

        for (const comment of commentData[0]) {
            const userName = await User.getUserName(comment.user_id)
            userData.push(userName[0][0].username)
        }


        for (let i = 0; i < commentData[0].length; i++) {
        
            const username = userData[i]
            const content = commentData[0][i].content
            const user_id = commentData[0][i].user_id
            const post_id = commentData[0][i].post_id
            const comment_id = commentData[0][i].comment_id
            const date = new Date(commentData[0][i].time_created)
            const formatDate = date.toLocaleString()
        
            comments.push({ username, content, user_id, post_id, comment_id, formatDate })
        
        }

        res.render('post', { post: post, comments: comments , title: "Post", currentUser: currentUser[0][0].username, currentUserId: req.session.user.user_id  })
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const getEditComment = async (req, res, next) => {
    const comment_id = req.params.id
    const previousUrl = req.headers.referer;
    try {
        const content = await Comment.getContent(comment_id)
        const user_id = await Comment.getUserId(comment_id)
        const userName = await User.getUserName(user_id[0][0].user_id)

        res.render("edit", { title: 'Edit Comment', type: 'comment', content: content[0][0].content, id: comment_id, username: userName[0][0].username, previousUrl: previousUrl, currentUserId: req.session.user.user_id });
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const postEditComment = async (req, res, next) => {
    const comment_id = req.params.id;
    const { content } = req.body
      
    try {
        const post_id = await Comment.getPostId(comment_id)
        await Comment.updateComment(content, comment_id);
        return res.redirect('/twitter/post/' + post_id[0][0].post_id);
    } catch (error) {
      res.render('error', { title: "Something went wrong", message: error.message });
    }
}

module.exports = {
    getAllComments,
    postAddComment,
    deleteComment,
    getEditComment,
    postEditComment
}