const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/Models/User.js');
const Post = require('../lib/Models/Post.js');
const Comment = require('../lib/Models/Comment.js');

async function saveUser() {
  const testUser = [{
    username: 'test-github',
    avatar: 'image.png'
  }];
  await Promise.all(
    testUser.map(async (arr) => {
      await request(app)
        .get('/api/v1/auth/login/callback')
        .send(arr);
    })
  );
}

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

async function saveComments() {
  const testComment = [
    {
      comment: '10/10',
      post: '1',
      username: 'test-github',
    },
    {
      comment: '7/10',
      post: '1',
      username: 'test-github',
    },
  ];
  await Promise.all(
    testComment.map(async (arr) => {
      await request(app).post('/api/v1/comments').send(arr);
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
      id: '3',
      username: 'test-user',
      photo: 'photo.jpg',
      caption: 'sure is a photo',
      tags: ['#photography', '#myphotos'],
    }
    );
  });

  it('get all posts from grams tables', async () => {
    await savePosts();
    const res = await request(app).get('/api/v1/grams');


    expect(res.body).toEqual([{
      id: '1',
      photo: 'gram.png',
      caption: 'words-here',
      tags: ['#photography', '#myphotos'],
      username: 'test-github'

    },
    {
      id: '2',
      photo: 'gram.png',
      caption: 'words-here',
      tags: ['#wow', '#sogood'],
      username: 'test-github',
    }
    ]);
  });

  it('get post by id from grams tables', async () => {
    await saveUser();
    await savePosts();
    await saveComments();
    const res = await request(app)
      .get('/api/v1/grams/1');


    expect(res.body).toEqual({
      id: '1',
      username: 'test-github',
      photo: 'gram.png',
      caption: 'words-here',
      tags: ['#photography', '#myphotos'],
      comments: [{
        id: '1',
        comment_by: 'test-github',
        original_post: '1',
        comment: 'comment-here'
      }]
    });
  });

  it('patches a post by id requiring auth and only caption can be updated', async () => {
    await saveUser();
    await savePosts();
    await saveComments();


    const res = await request(app)
      .patch('/api/v1/grams/1')
      .send({
        id: '1',
        username: 'test-github',
        photo: 'gram.png',
        caption: 'more-words-here',
        tags: ['#photography', '#myphotos']
      });

    expect(res.body).toEqual({
      id: '1',
      username: 'test-github',
      photo: 'gram.png',
      caption: 'more-words-here',
      tags: ['#photography', '#myphotos']
    });

  });

  it('removes a post by id', async () => {
    await saveUser();
    await savePosts();
    await saveComments();

    const res = await request(app)
      .delete('/api/v1/grams/1');
    expect(res.body).toEqual({});

  });

    
  it('should return the 10 posts with the most comments', async () => {
    await saveUser();
    await savePosts();
    await saveComments();
    // const user = await User.insert({
    //   username: 'test-user',
    //   avatar: 'image.png',
    // });

    // const post1 = await Post.insert({
    //   username: 'test-user',
    //   photo: 'photo.gif',
    //   caption: 'a caption',
    //   tags: ['#tags'],
    // });

    // await Comment.insert({
    //   comment_by: 'test-user',
    //   post: post1.id,
    //   comment: 'a comment',
    // });
    // const post2 = await Post.insert({
    //   username: 'test-user',
    //   photo: 'photo.gif',
    //   caption: 'a caption',
    //   tags: ['#tags'],
    // });

    // await Comment.insert({
    //   comment_by: 'test-user',
    //   post: post2.id,
    //   comment: 'a comment',
    // });

    // // const post3 = await Post.insert({
    // //   username: 'test-user',
    // //   photo: 'photo.gif',
    // //   caption: 'a caption',
    // //   tags: ['#tags'],
    // // });

    // // await Comment.insert({
    // //   comment_by: 'test-user',
    // //   post: post3.id,
    // //   comment: 'a comment',
    // // });

    // // const post4 = await Post.insert({
    // //   username: 'test-user',
    // //   photo: 'photo.gif',
    //   caption: 'a caption',
    //   tags: ['#tags'],
    // });

    // await Comment.insert({
    //   comment_by: 'test-user',
    //   post: post4.id,
    //   comment: 'a comment',
    // });

    // const post5 = await Post.insert({
    //   username: 'test-user',
    //   photo: 'photo.gif',
    //   caption: 'a caption',
    //   tags: ['#tags'],
    // });

    // await Comment.insert({
    //   comment_by: 'test-user',
    //   post: post5.id,
    //   comment: 'a comment',
    // });

    // const post6 = await Post.insert({
    //   username: 'test-user',
    //   photo: 'photo.gif',
    //   caption: 'a caption',
    //   tags: ['#tags'],
    // });

    // await Comment.insert({
    //   comment_by: 'test-user',
    //   post: post6.id,
    //   comment: 'a comment',
    // });

    // const post7 = await Post.insert({
    //   username: 'test-user',
    //   photo: 'photo.gif',
    //   caption: 'a caption',
    //   tags: ['#tags'],
    // });

    // await Comment.insert({
    //   comment_by: 'test-user',
    //   post: post7.id,
    //   comment: 'a comment',
    // });

    // const post8 = await Post.insert({
    //   username: 'test-user',
    //   photo: 'photo.gif',
    //   caption: 'a caption',
    //   tags: ['#tags'],
    // });

    // await Comment.insert({
    //   comment_by: 'test-user',
    //   post: post8.id,
    //   comment: 'a comment',
    // });

    // const post9 = await Post.insert({
    //   username: 'test-user',
    //   photo: 'photo.gif',
    //   caption: 'a caption',
    //   tags: ['#tags'],
    // });

    // await Comment.insert({
    //   comment_by: 'test-user',
    //   post: post9.id,
    //   comment: 'a comment',
    // });

    // const post10 = await Post.insert({
    //   username: 'test-user',
    //   photo: 'photo.gif',
    //   caption: 'a caption',
    //   tags: ['#tags'],
    // });

    // await Comment.insert({
    //   comment_by: 'test-user',
    //   post: post10.id,
    //   comment: 'a comment',
    // });

    const res = await request(app).get('/api/v1/grams/popular');
    console.log('OOOMMMGGG', res.body);
    expect(res.body).toEqual(
      // expect.arrayContaining(
      //   [
      //   // post1,
      //   // post2
      //   // // post3,
      //   // post4,
      //   // post5,
      //   // post6,
      //   // post7,
      //   // post8,
      //   // post9,
      //   // post10,
      // ]
      // )
    );
  });
});
