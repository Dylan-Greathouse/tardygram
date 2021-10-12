const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should return proper username and avatar', async () => {
    const res = await request(app).get('/api/v1/auth/login');

    expect(res.body).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
