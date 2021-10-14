const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');


jest.mock('../lib/middleware/ensureAuth.js', () => {
  return (req, res, next) => {
    req.user = {
      username: 'fake-github',
      avatar: 'fake_image.png',
      iat: Date.now(),
      exp: Date.now()
    };
    next();
  };
});

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should return proper username and avatar', async () => {
    const res = await request(app).get('/api/v1/auth/verify');
    expect(res.body).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number)
    });
  });

  afterAll(() => {
    pool.end();
  });
});
