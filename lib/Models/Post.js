const pool = require('../utils/pool');

module.exports = class Post {
  id;
  username;
  photo;
  caption;
  // tags;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.photo = row.photo_url;
    this.caption = row.caption;
    // this.tags = row.tags;
  }

  static async insert({ username, photo, caption }) {
    const { rows } = await pool.query(
      'INSERT INTO grams (username, photo_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [username, photo, caption]
    );

    return new Post(rows[0]);
  }

  static async select() {
    const { rows } = await pool.query(
      'SELECT * FROM grams'
    );

    return rows.map((row) => new Post(row));
  }
};
