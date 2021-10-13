DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS grams CASCADE;
-- DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE users (
github_login TEXT NOT NULL PRIMARY KEY,
github_avatar_url TEXT NOT NULL
);

-- CREATE TABLE grams (
-- id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
-- username TEXT NOT NULL,
-- FOREIGN KEY (username) REFERENCES users(github_login),
-- photo_url TEXT NOT NULL,
-- caption TEXT NOT NULL,
-- tags TEXT NOT NULL
-- );

-- CREATE TABLE comments (
-- id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
-- comment_by TEXT NOT NULL,
-- FOREIGN KEY (comment_by) REFERENCES users(github_login),
-- post TEXT NOT NULL,
-- FOREIGN KEY (post) REFERENCES grams(id),
-- comment TEXT NOT NULL
-- );