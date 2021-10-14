const pool = require('../utils/pool');
<<<<<<< HEAD

=======
>>>>>>> 21c8ede683aa523292afc15c0bb4cfaee3aefe8a

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
};
