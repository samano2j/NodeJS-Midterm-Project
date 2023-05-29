const db = require("../service/mysql")
const { v4: uuid }  = require('uuid')

module.exports = class Comment {
    constructor(content, post_id, user_id) {
      this.comment_id = uuid()
      this.content = content
      this.post_id = post_id
      this.user_id = user_id
    }

    async save() {
        const sql = "INSERT INTO comments (comment_id, content, post_id, user_id) VALUES (?, ?, ?, ?)"
        const params = [this.comment_id, this.content, this.post_id, this.user_id]
        return db.execute(sql, params)
    }

    static async fetchAllComments(id) {
        const sql = "SELECT * FROM comments WHERE post_id = ? ORDER BY time_created DESC"
        return db.execute(sql, [id])
    }

    static async deleteComment(id) {
        const sql = "DELETE FROM comments WHERE comment_id = ?"
        return db.execute(sql, [id])
    }

    static async getContent(id) {
        const sql = "SELECT content FROM comments WHERE comment_id = ?"
        return db.execute(sql, [id])
    }

    static async getUserId(id) {
        const sql = "SELECT user_id FROM comments WHERE comment_id = ?"
        return db.execute(sql, [id])
    }

    static async updateComment(content, comment_id) {
        const sql = "UPDATE comments SET content = ?, time_created = CURRENT_TIMESTAMP WHERE comment_id = ?"
        const params = [content, comment_id];
        return db.execute(sql, params)
    }

    static async getPostId(id) {
        const sql = "SELECT post_id FROM comments WHERE comment_id = ?"
        return db.execute(sql, [id])
    }
}