
const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/Models/User.js');


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

async function savePosts(){
  const testPost = [{
    username: 'test-github',
    photo: 'photo-2.jpg',
    caption: 'sure is a photo',
    tags: ['#photography', '#myphotos'],
  }];
  await Promise.all(
    testPost.map(async (arr) => {
      await request(app).post('/api/v1/grams').send(arr);
    })
  );
}




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


  it('should create a comment from a user', async () => {
    await saveUser();
    await savePosts();

    const testComment = {
      // id: '1',
      username: 'test-github',
      post: '1',
      comment: 'commenting',
    };
 
    const res = await request(app)
      .post('/api/v1/comments')
      .send(testComment);

    expect(res.body).toEqual({
      id: '2',
      username: 'test-github',
      post: '1',
      comment: 'commenting'
    });
  });

  afterAll(() => {
    pool.end();
  });
});
