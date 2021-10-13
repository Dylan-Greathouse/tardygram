const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class User {
    username;
    avatar;

    constructor(row) {
        this.username = row.github_login;
        this.avatar = row.github_avatar_url;
    }

    static async insert({ username, avatar }) {
        const{ rows } = await pool.query(
            'INSERT INTO users (github_login, github_avatar_url) VALUES ($1, $2) RETURNING *',
            [username, avatar]
        );

        return new User(rows[0]);
    }

    static async findByUsername(username) {
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE github_login = $1',
            [username]
        );

        if(!rows[0]) return null;
        return new User(rows[0]);
    }

    authToken() {
        return jwt.sign(this.toJSON(), rocess.env.APP_SECRET, {
            expiresIn: '24h'
        });
    }

    toJSON() {
        return {
            username: this.username,
            avatar: this.avatar
        }
    }
};