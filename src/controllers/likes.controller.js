const Post = require('../models/posts')
const User = require('../models/users')
const Comment = require('../models/comments')
const Like = require('../models/likes')

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
    postLikePost
}