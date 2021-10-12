const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class User {
    username;
    avatar;

    constructor(row) {
        this.username = row.github_user
        this.avatar = row.github_avatar_url
    }

    static async insert({ username, avatar}) {
        const{ rows } = await pool.query(
            'INSERT INTO users (github_user, github_avatar_url) VALUES ($1, $2) RETURNING *',
            [username, avatar]
        );

        return new User(rows[0])
    }

    static async findByUsername(username) {
        const { rows } = await pool.query(
            'SELECT * FROM users where github_user = $1',
            [username]
        );

        if(!rows[0]) return null;
        return new User(rows[0])
    }
}