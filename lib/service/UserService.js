const fetch = require('cross-fetch');
const User = require('../Models/User.js');
const { tradeCodeForToken, getUserLogin } = require('../utils/githubApi.js');


module.exports = class UserService {

  static async create(code) {
    const accessToken = await tradeCodeForToken(code);
    
    const userBody = await getUserLogin(accessToken);

    let user = await User.findByUsername(userBody.login);
    if (!user) {
      user = await User.insert({
        username: userBody.login,
        avatar: userBody.avatar_url,
      });

    }
    return user;

  }
};
