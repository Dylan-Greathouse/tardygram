const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

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

static async insert( username, photo, caption, tags ) {
    const { rows } = await pool.query(
      'INSERT INTO grams (username, photo_url, caption, tags) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, photo, caption, tags]
    );

    return new Post(rows[0]);
  }
};
