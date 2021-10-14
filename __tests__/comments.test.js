
const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/Models/User.js');

const testComment = {
  user: 'test-user',
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
    });
  });

  afterAll(() => {
    pool.end();
  });
});
