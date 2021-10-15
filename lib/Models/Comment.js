const pool = require('../utils/pool');

module.exports = class Comment {
    id;
    username;
    post;
    comment;

    constructor(row) {
        this.id = row.id;
        this.username = row.comment_by;
        this.post = row.original_post;
        this.comment = row.comment;
    }

    static async insert({ username, post, comment }) {
        const { rows } = await pool.query(
            'INSERT INTO comments (comment_by, original_post, comment) VALUES ($1, $2, $3) RETURNING *',
            [username, post, comment]
        );
        return new Comment(rows[0]);
    }

    static async remove(id) {
        const { rows } = await pool.query(
            'DELETE FROM comments WHERE id = $1', [id]
        );
        return new Comment(rows[0]);
    }
}