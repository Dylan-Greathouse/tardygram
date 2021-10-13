const fetch = require('cross-fetch');

const tradeCodeForToken = async (oauthCode) => {

  const tokenRes = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: oauthCode,
      }),
    }
  );
  
  const tokenBody = await tokenRes.json();
  return tokenBody.access_token;
};

const getUserLogin = async (token) => {
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  
  const userBody = await userRes.json();
  return userBody;

};

module.exports = { tradeCodeForToken, getUserLogin };
