const pool = require('../utils/pool');

module.exports = class Post {
  id;
  username;
  photo;
  caption;
  tags;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.photo = row.photo_url;
    this.caption = row.caption;
    this.tags = row.tags;
  }

  static async insert({ username, photo, caption, tags }) {
    const { rows } = await pool.query(
      'INSERT INTO grams (username, photo_url, caption, tags) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, photo, caption, tags]
    );

    return new Post(rows[0]);
  }

  static async select() {
    const { rows } = await pool.query(
      `SELECT * FROM grams
      INNER JOIN users
      ON users.github_login = grams.username`
    );

    return rows.map((row) => new Post(row));
  }

  static async selectPop() {
    const { rows } = await pool.query(
      `SELECT *, COUNT(comments.comment) FROM grams
      INNER JOIN comments
      ON grams.id = comments.original_post
      GROUP BY grams.id, comment.id
      ORDER BY count DESC
      LIMIT 10`
    )
  }

  static async selectId(id) {
    const { rows } = await pool.query(
      `SELECT * FROM grams
      INNER JOIN users
      ON grams.username = users.github_login
      WHERE id = $1`,
      [id]
    );
    const comments = await pool.query(
      `SELECT * FROM comments`
    );

    const postRow = new Post(rows[0]);
    console.log('AT SELECT ID POSTS', comments.rows )
      return { ...postRow, comments: comments.rows }
  }

  static async update(id, {caption}) {
    const { rows } = await pool.query(
      `UPDATE grams
      SET caption = $2
      WHERE id = $1
      RETURNING *`, [id, caption]
    );
      return new Post(rows[0]);
  }

  static async remove(id) {
    
    const { rows } = await pool.query(
      `SELECT grams.id, username, photo_url, caption, tags FROM grams
      INNER JOIN comments
      ON comments.original_post = grams.id
      INNER JOIN users
      ON users.github_login = comments.comment_by
      WHERE grams.id = $1`, [id]
    );

    // const user = await pool.query(
    //   'DELETE FROM users WHERE github_login = $1', [github_login]
    // );

    const comment = await pool.query(
      'DELETE FROM comments WHERE id = $1', [id]
    );

    const grams = await pool.query(
      'DELETE FROM grams'
      );

    return new Post(comment.rows, grams.rows);
    
  }

 
};
