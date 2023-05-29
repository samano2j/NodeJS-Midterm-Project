const Post = require('../models/posts')
const User = require('../models/users')
const Comment = require('../models/comments')
const Like = require('../models/likes')

const getLogin = async (req, res, next) => {
    try {
        const { title, header } = req.session
        req.session.title = null
        req.session.header = null

        res.render('login', { title: title || 'Log In', header: header || 'Welcome!' })
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
            
            req.session.currentUser = currentUser[0][0].username
            req.session.tweetData = tweetData


            // res.render('home', {  tweetData: tweetData , title: "Home", currentUser: currentUser[0][0].username, currentUserId: req.session.user.user_id})
            res.redirect('/twitter/home')
        }
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const getSignUp = async (req, res, next) => {
    try {
        res.render('signup', { title: 'Sign Up', header: 'Sign Up'})
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
    }
}

const postSignUp = async (req, res, next) => {
    const { username, password } = req.body
    try {
        const matchUser = await User.checkUserName(username)
        if(matchUser[0].length > 0) {
            res.render('signup', { title: 'Sign Up', header: 'Username already used' })
        } 
        else {
            const newUser = new User(username, password)
            await newUser.save()
            req.session.title = 'Log In';
            req.session.header = 'Sign Up Successful!';

            // res.render('login', { title: 'Log In', header: 'Sign Up Successful!' })
            res.redirect('/twitter/login')
        }
    } catch (error) {
        res.render('error', { title: "Something went wrong", message: error.message })
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

module.exports = {
    getLogin,
    getSignUp,
    postLogin,
    postSignUp,
    postLogout
}