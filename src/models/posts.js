const db = require("../service/mysql")
const { v4: uuid }  = require('uuid')

module.exports = class Post {
    constructor(user_id, content) {
        this.post_id = uuid()
        this.user_id = user_id
        this.content = content
    }

    static async fetchAllPosts() {
        const sql = "SELECT * FROM posts ORDER BY time_created DESC"
        return await db.query(sql)
    }

    static async fetchUserPosts(id) {
        const sql = "SELECT * FROM posts WHERE user_id = ? ORDER BY time_created DESC"
        return db.execute(sql, [id])
    }

    async save() {
        const sql = "INSERT INTO posts (post_id, content, user_id) VALUES (?, ?, ?)"
        const params = [this.post_id, this.content, this.user_id]
        return db.execute(sql, params)
    }

    static async deletePost(id) {
        const sql1 = "DELETE FROM posts WHERE post_id = ?"
        const sql2 = "DELETE FROM comments WHERE post_id = ?"
        await db.execute(sql2, [id])
        return db.execute(sql1, [id])
    }

    static async getContent(id) {
        const sql = "SELECT content FROM posts WHERE post_id = ?"
        return db.execute(sql, [id])
    }   

    static async updatePost(content, id) {
        const sql = "UPDATE posts SET content = ?, time_created = CURRENT_TIMESTAMP WHERE post_id = ?"
        const params = [content, id];
        return db.execute(sql, params)
    }

    static async getUserId(id) {
        const sql = "SELECT user_id FROM posts WHERE post_id = ?"
        return await db.execute(sql, [id])
    }

    static async getPostbyId(id) {
        const sql = "SELECT * FROM posts WHERE post_id = ?"
        return db.execute(sql, [id])
    }

    static async addLike(id) {
        const sql = "UPDATE posts SET numLikes = numLikes + 1 WHERE post_id = ?"
        return db.execute(sql, [id])
    }

    static async subtractLike(id) {
        const sql = "UPDATE posts SET numLikes = numLikes - 1 WHERE post_id = ?"
        return db.execute(sql, [id])
    }
}