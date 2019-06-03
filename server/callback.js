const micro = require("micro")
const axios = require("axios")
const url = require("url")
const cookie = require("cookie")
const qs = require("querystring")
const {HEROKU_CLIENT_SECRET} = process.env;

function send(res, statusCode, content) {
	res.writeHead(statusCode);
	res.end(content);
}

async function getTokens(code) {
  return axios.post("https://id.heroku.com/oauth/token", null, {
    params: {
      grant_type: "authorization_code", code, client_secret: HEROKU_CLIENT_SECRET
    }
  }).then(res => {
    return res.data
  }).catch(err => console.log(err.response))
}

module.exports = async (req, res) => {
  const { query } = url.parse(req.url, true);
  const { code, state } = query;
  const cookies = cookie.parse(req.headers.cookie);
  const context = JSON.parse(cookies['addon-ctx'] || '{}');
  const tokens = await getTokens(code)
  tokens.created = Date.now()
  if (state !== context.state) {
    return send(res, 403, 'Invalid state');
  }
  res.writeHead(302, {
    Location: `${context.next}/?${qs.stringify(tokens)}`,
    'Set-Cookie': cookie.serialize('addon-ctx', '', { path: '/' })
	});
	
  res.end('Redirecting...')
}