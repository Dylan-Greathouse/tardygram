const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/service/UserService.js');
const User = require('../lib/Models/User.js');


jest.mock('../lib/middleware/ensureAuth.js', () => {
  return (req, res, next) => {
    req.user = {
      username: 'test-github',
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
    
    const agent = request.agent(app);

    await agent.get('/api/v1/auth/login/callback');

    const res = await agent
      .post('/post')
      .send({
        // username: 'test-github',
        photo: 'https://images.fineartamerica.com/images/artworkimages/medium/2/cool-t-rex-filip-hellman-transparent.png',
        caption: 'wow, what a picture',
        tags: '#apicture #wow',
      });

    console.log('AT POST TEST', res.body);

    expect(res.body).toEqual({
      id: '1',
      username: 'test-github',
      photo: 'https://images.fineartamerica.com/images/artworkimages/medium/2/cool-t-rex-filip-hellman-transparent.png',
      caption: 'wow, what a picture',
      tags: '#apicture #wow',
    });
  });

  afterAll(() => {
    pool.end();
  });
});
