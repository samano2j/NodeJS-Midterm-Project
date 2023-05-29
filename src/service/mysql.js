const mysql = require('mysql2')

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DBNAME,
    port: process.env.MYSQL_PORT,
    ssl: {
        "rejectUnauthorized": true
    }
})


module.exports = pool.promise()