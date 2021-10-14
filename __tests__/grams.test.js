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
  },
  {
    photo: 'image.jpg',
    caption: 'sure is a image',
    tags: ['#wow', '#sogood'],
  }];
  await Promise.all(
    testPost.map(async (arr) => {
      await request(app).post('/api/v1/grams').send(arr);
    })
  );
}



const testPost = {
  photo: 'photo.jpg',
  caption: 'sure is a photo',
  tags: ['#photography', '#myphotos'],
};

jest.mock('../lib/middleware/ensureAuth.js', () => {
  return (req, res, next) => {
    req.user = {
      username: 'test-user',
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
      username: 'test-user',
      photo: 'photo.jpg',
      caption: 'sure is a photo',
      tags: ['#photography', '#myphotos'],
    });
  });


  it('get all posts from grams tables', async() => {
    await savePosts();
    const res = await request(app)
      .get('/api/v1/grams');

    expect(res.body).toEqual([{
      id: '1',
      photo: 'photo.jpg',
      caption: 'sure is a photo',
      tags: ['#photography', '#myphotos'],
      username: 'test-user'

    },
    {
      id: '2',
      photo: 'image.jpg',
      caption: 'sure is a image',
      tags: ['#wow', '#sogood'],
      username: 'test-user'

    }]);
  });

  afterAll(() => {
    pool.end();
  });
});
