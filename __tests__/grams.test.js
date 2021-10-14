const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/Models/User.js');
const Post = require('../lib/Models/Post.js');
const Comment = require('../lib/Models/Comment.js');

async function savePosts() {
  const testPost = [
    {
      photo: 'photo.jpg',
      caption: 'sure is a photo',
      tags: ['#photography', '#myphotos'],
    },
    {
      photo: 'image.jpg',
      caption: 'sure is a image',
      tags: ['#wow', '#sogood'],
    },
  ];
  await Promise.all(
    testPost.map(async (arr) => {
      await request(app).post('/api/v1/grams').send(arr);
    })
  );
}

const testPost = {
  photo: 'photo.jpg',
  caption: 'sure is a photo',
  tags: ['#photography', '#myphotos'],
};

jest.mock('../lib/middleware/ensureAuth.js', () => {
  return (req, res, next) => {
    req.user = {
      username: 'test-user',
      avatar: 'image.png',
      iat: Date.now(),
      exp: Date.now(),
    };

    next();
  };
});

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should create a post from a user', async () => {
    const user = await User.insert({
      username: 'test-user',
      avatar: 'image.png',
    });

    const agent = await request.agent(app);
    await agent.get('/api/v1/auth/login').send({
      username: 'test-user',
      avatar: 'image.png',
    });

    const res = await agent
      .post('/api/v1/grams')
      .send({ ...testPost, username: user.id });

    expect(res.body).toEqual({
      id: '1',
      username: 'test-user',
      photo: 'photo.jpg',
      caption: 'sure is a photo',
      tags: ['#photography', '#myphotos'],
    });
  });

  it('get all posts from grams tables', async () => {
    await savePosts();
    const res = await request(app).get('/api/v1/grams');

    expect(res.body).toEqual([
      {
        id: '1',
        photo: 'photo.jpg',
        caption: 'sure is a photo',
        tags: ['#photography', '#myphotos'],
        username: 'test-user',
      },
      {
        id: '2',
        photo: 'image.jpg',
        caption: 'sure is a image',
        tags: ['#wow', '#sogood'],
        username: 'test-user',
      },
    ]);
  });

  it('should return the 10 posts with the most comments', async () => {
    const user = await User.insert({
      username: 'test-user',
      avatar: 'image.png',
    });

    const post1 = await Post.insert({
      username: user.id,
      photo: 'photo.gif',
      caption: 'a caption',
      tags: ['#tags'],
    });

    await Comment.insert({
      username: user.id,
      post: post1.id,
      comment: 'a comment',
    });
    const post2 = await Post.insert({
      username: user.id,
      photo: 'photo.gif',
      caption: 'a caption',
      tags: ['#tags'],
    });

    await Comment.insert({
      username: user.id,
      post: post2.id,
      comment: 'a comment',
    });

    const post3 = await Post.insert({
      username: user.id,
      photo: 'photo.gif',
      caption: 'a caption',
      tags: ['#tags'],
    });

    await Comment.insert({
      username: user.id,
      post: post3.id,
      comment: 'a comment',
    });

    const post4 = await Post.insert({
      username: user.id,
      photo: 'photo.gif',
      caption: 'a caption',
      tags: ['#tags'],
    });

    await Comment.insert({
      username: user.id,
      post: post4.id,
      comment: 'a comment',
    });

    const post5 = await Post.insert({
      username: user.id,
      photo: 'photo.gif',
      caption: 'a caption',
      tags: ['#tags'],
    });

    await Comment.insert({
      username: user.id,
      post: post5.id,
      comment: 'a comment',
    });

    const post6 = await Post.insert({
      username: user.id,
      photo: 'photo.gif',
      caption: 'a caption',
      tags: ['#tags'],
    });

    await Comment.insert({
      username: user.id,
      post: post6.id,
      comment: 'a comment',
    });

    const post7 = await Post.insert({
      username: user.id,
      photo: 'photo.gif',
      caption: 'a caption',
      tags: ['#tags'],
    });

    await Comment.insert({
      username: user.id,
      post: post7.id,
      comment: 'a comment',
    });

    const post8 = await Post.insert({
      username: user.id,
      photo: 'photo.gif',
      caption: 'a caption',
      tags: ['#tags'],
    });

    await Comment.insert({
      username: user.id,
      post: post8.id,
      comment: 'a comment',
    });

    const post9 = await Post.insert({
      username: user.id,
      photo: 'photo.gif',
      caption: 'a caption',
      tags: ['#tags'],
    });

    await Comment.insert({
      username: user.id,
      post: post9.id,
      comment: 'a comment',
    });

    const post10 = await Post.insert({
      username: user.id,
      photo: 'photo.gif',
      caption: 'a caption',
      tags: ['#tags'],
    });

    await Comment.insert({
      username: user.id,
      post: post10.id,
      comment: 'a comment',
    });

    const res = await request(app).get('/api/v1/grams/popular');
    expect(res.body).toEqual(
      expect.arrayContaining([
        post1,
        post2,
        post3,
        post4,
        post5,
        post6,
        post7,
        post8,
        post9,
        post10,
      ])
    );
  });

  afterAll(() => {
    pool.end();
  });
});
