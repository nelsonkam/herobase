const micro = require("micro")
const url = require("url")
const cookie = require("cookie")
const {HEROKU_CLIENT_ID} = process.env;

function getRedirectUrl(state) {
  const clientId = HEROKU_CLIENT_ID;
  return `https://id.heroku.com/oauth/authorize?client_id=${clientId}&response_type=code&scope=global&state=${state}`
}

module.exports = (req, res) => {
  const { query } = url.parse(req.url, true);
  const state = `state_${Math.random()}`;
  res.writeHead(302, {
    Location: getRedirectUrl(state),
    'Set-Cookie': cookie.serialize('addon-ctx', JSON.stringify({next: query.next, state}), {path: '/'})
	});
	
  res.end('Redirecting...')
}