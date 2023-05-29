const db = require("../service/mysql")
const { v4: uuid }  = require('uuid')

module.exports = class User {
    constructor(username, password) {
        this.user_id = uuid()
        this.username = username
        this.password = password
    }

    async save() {
        const sql = "INSERT INTO users (user_id, username, password) VALUES (?, ?, ?)"
        const params = [this.user_id, this.username, this.password]
        return db.execute(sql, params)
    }

    static async getUserName(id) {
        const sql = "SELECT username FROM users WHERE user_id = ?"
        return await db.execute(sql, [id])
    }

    static async matchInfo(username, password) {
        const sql = "SELECT * FROM users WHERE username = ? AND password = ?"
        return await db.execute(sql, [username, password])
    }

    static async getUserId(username) {
        const sql = "SELECT user_id FROM users WHERE username = ?"
        return await db.execute(sql, [username])
    }

    static async checkUserName(username) {
        const sql = "SELECT ? from users WHERE username = ?"
        return await db.execute(sql, [username, username])
    }
}