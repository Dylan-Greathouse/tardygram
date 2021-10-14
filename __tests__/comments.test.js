
const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/Models/User.js');


async function savePosts(){
  const testPost = [{
    photo: 'photo.jpg',
    caption: 'sure is a photo',
    tags: ['#photography', '#myphotos'],
  }];
  await Promise.all(
    testPost.map(async (arr) => {
      await request(app).post('/api/v1/grams').send(arr);
    })
  );
}


const testComment = {
  username: 'test-user',
  post: 'original-post',
  comment: 'commenting',
};

jest.mock('../lib/middleware/ensureAuth.js', () => {
  return (req, res, next) => {
    req.user = {
      username: 'Dylan-Greathouse',
      avatar: 'https://avatars.githubusercontent.com/u/20326640?v=4',
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


  it('should create a comment from a user', async () => {
    await savePosts();
    // const user = await User.insert({
    //   username: 'test-user',
    //   avatar: 'image.png',
    // });

    // const agent = await request.agent(app);
    // await agent.get('/api/v1/auth/login').send({
    //   username: 'test-user',
    //   avatar: 'image.png',
    // });

    // const resPost = await agent
    //   .post('/api/v1/grams')
    //   .send({ ...testPost, username: user.id });

    const res = await request(app)
      .post('/api/v1/comments')
      .send(testComment);

    expect(res.body).toEqual({
      id: '1',
      username: 'test-user',
      post: '1',
      comment: 'commenting'
    });
  });

  afterAll(() => {
    pool.end();
  });
});
