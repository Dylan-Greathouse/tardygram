const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

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

  it('should create a post from a user', async () => {
    const res = await request(app).post('/api/v1/auth/posts').send({
      username: 'Dylan-Greathouse',
      photo:
        'https://images.fineartamerica.com/images/artworkimages/medium/2/cool-t-rex-filip-hellman-transparent.png',
      caption: 'wow, what a picture',
      tags: '#apicture #wow',
    });

    expect(res.body).toEqual({
      id: '1',
      username: 'Dylan-Greathouse',
      photo:
        'https://images.fineartamerica.com/images/artworkimages/medium/2/cool-t-rex-filip-hellman-transparent.png',
      caption: 'wow, what a picture',
      tags: '#apicture #wow',
    });
  });

  afterAll(() => {
    pool.end();
  });
});
