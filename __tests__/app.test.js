const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/models/User.js');

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should return proper username and avatar', async (res) => {
    await request(app).get('/api/v1/auth/login');
    // const testUser = await User.insert(res.body);
    // console.log('HELLLOOO', res.body);
    expect(res.user).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
