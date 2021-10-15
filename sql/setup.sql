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
FOREIGN KEY (username) REFERENCES users(github_login),
photo_url TEXT NOT NULL,
caption TEXT NOT NULL,
tags TEXT[]
);


CREATE TABLE comments (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
comment_by TEXT NOT NULL,
FOREIGN KEY (comment_by) REFERENCES users(github_login),
original_post BIGINT,
FOREIGN KEY (original_post) REFERENCES grams(id),
comment TEXT NOT NULL
);


INSERT INTO users (github_login, github_avatar_url) 
VALUES ('test-github', 'image.png');

INSERT INTO grams (username, photo_url, caption, tags)
VALUES ('test-github', 'gram.png', 'words-here', ARRAY['#photography', '#myphotos']),('test-github', 'gram.png', 'words-here', ARRAY['#wow', '#sogood']);

INSERT INTO comments (comment_by, original_post, comment) 
VALUES ('test-github', '1', 'comment-here');