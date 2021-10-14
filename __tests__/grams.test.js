const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/service/UserService.js');
const User = require('../lib/Models/User.js');
const { agent } = require('superagent');

const testPost = {
  photo: 'photo.jpg',
  caption: 'sure is a photo',
  tags: ['#photography', '#myphotos'],
};

jest.mock('../lib/middleware/ensureAuth.js', () => {
  return (req, res, next) => {
    req.user = {
<<<<<<< HEAD
      username: 'test-github',
=======
      username: 'test-user',
>>>>>>> 21c8ede683aa523292afc15c0bb4cfaee3aefe8a
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
<<<<<<< HEAD
      username: 'test-github',
      photo: 'https://images.fineartamerica.com/images/artworkimages/medium/2/cool-t-rex-filip-hellman-transparent.png',
      caption: 'wow, what a picture',
      tags: '#apicture #wow',
=======
      username: 'test-user',
      photo: 'photo.jpg',
      caption: 'sure is a photo',
>>>>>>> 21c8ede683aa523292afc15c0bb4cfaee3aefe8a
    });
  });

  afterAll(() => {
    pool.end();
  });
});
