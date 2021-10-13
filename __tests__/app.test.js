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

  it('should return user testing ensureAuth at /verify using mock', async () => {
    const res = await request(app).get('/api/v1/auth/verify');
    expect(res.body).toEqual({
      username: 'Dylan-Greathouse',
      avatar: 'https://avatars.githubusercontent.com/u/20326640?v=4',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
