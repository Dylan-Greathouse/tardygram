DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS grams CASCADE;

DROP TABLE IF EXISTS comments;


CREATE TABLE users (
github_login TEXT NOT NULL PRIMARY KEY,
github_avatar_url TEXT NOT NULL
);

CREATE TABLE grams (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
username TEXT NOT NULL,
photo_url TEXT NOT NULL,
caption TEXT NOT NULL,
tags TEXT[]
);


CREATE TABLE comments (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
comment_by TEXT NOT NULL,
FOREIGN KEY (comment_by) REFERENCES users(github_login),
original_post TEXT NOT NULL,
-- FOREIGN KEY (original_post) REFERENCES grams(id),
comment TEXT NOT NULL
);


INSERT INTO users (github_login, github_avatar_url) VALUES ('test-github', 'image.png')
