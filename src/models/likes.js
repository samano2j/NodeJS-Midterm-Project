const db = require("../service/mysql")
const { v4: uuid }  = require('uuid')

module.exports = class Like {
    constructor(post_id, user_id) {
        this.like_id = uuid()
        this.post_id = post_id
        this.user_id = user_id
    }

    async save() {
        const sql = "INSERT INTO likes (like_id, post_id, user_id) VALUES (?, ?, ?)"
        const params = [this.like_id, this.post_id, this.user_id]
        return db.execute(sql, params)
    }

    static async getLikeId(post_id, user_id) {
        const sql = "SELECT like_id FROM likes WHERE post_id = ? AND user_id = ?"
        const params = [post_id, user_id]
        return db.execute(sql, params)
    }

    static async removeLike(post_id, user_id) {
        const sql = "DELETE FROM likes WHERE post_id = ? AND user_id = ?"
        const params = [post_id, user_id]
        return db.execute(sql, params)
    }

}