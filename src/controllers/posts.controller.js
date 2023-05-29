const Post = require('../models/posts')
const User = require('../models/users')
const Comment = require('../models/comments')
const Like = require('../models/likes')

const getLogin = async (req, res, next) => {
    try {
        res.render('login', { title: 'Log In', header: 'Welcome!' })
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const postLogin = async (req, res, next) => {
    const { username, password } = req.body

    try {
        const result = await User.matchInfo(username, password)
        if (result[0].length == 0) {
            res.render('login', { title: 'Log In', header: 'Invalid Credentials!' })
        }
        else {
            const user_id = await User.getUserId(username)

            req.session.user = {
                user_id: user_id[0][0].user_id
            }
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
            res.render('home', {  tweetData: tweetData , title: "Home", currentUser: currentUser[0][0].username, currentUserId: req.session.user.user_id})
        }
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const getSignUp = async (req, res, next) => {
    try {
        res.render('signup', { title: 'Sign Up' })
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const postSignUp = async (req, res, next) => {
    const { username, password } = req.body
    try {
        const newUser = new User(username, password)
        await newUser.save()
        res.render('login', { title: 'Log In', header: 'Sign Up Successful!' })
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const getAllPosts = async (req, res, next) => {
    
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


        res.render('home', { tweetData: tweetData , title: "Home", currentUser: currentUser[0][0].username, currentUserId: req.session.user.user_id })
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


const postLogout = async (req, res, next) => {
    try {
        req.session.user = {
            user_id: null
        }

        return res.redirect('/twitter/login')
    } catch (error) {
      res.render('error', { title: "Something went wrong", message: error.message });
    }
}

const postLikePost = async (req, res, next) => {
    const post_id = req.params.id
    const user_id = req.session.user.user_id

    try {
        const isLiked = await Like.getLikeId(post_id, user_id)

        if (isLiked[0].length > 0) {
            await Like.removeLike(post_id, user_id)
            await Post.subtractLike(post_id)
        }
        else {
            const newLike = new Like(post_id, user_id)
            await newLike.save()
            await Post.addLike(post_id)
        }

        res.redirect(req.headers.referer)
    } catch (error) {
      res.render('error', { title: "Something went wrong", message: error.message });
    }
}


module.exports = {
    getAllPosts,
    getUserPosts,
    postAddPost,
    deletePost,
    getEditPost,
    postEditPost,
    getAllComments,
    postAddComment,
    deleteComment,
    getEditComment,
    postEditComment,
    getLogin,
    getSignUp,
    postLogin,
    postSignUp,
    postLogout,
    postLikePost
}