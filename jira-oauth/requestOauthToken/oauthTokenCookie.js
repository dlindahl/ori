const cookie = require('cookie');

const MaxCookieAge = 1000 * 60 * 5; // 5 minutes

/*
 * Creates a cookie used to temporarily store the OAuth Tokens during the
 * redirect process. Expires after 5 minutes.
*/
module.exports = function oauthTokenCookie(event, tokens) {
  return cookie.serialize('oauth', JSON.stringify(tokens), {
    domain: event.headers.Host,
    expires: new Date(Date.now() + MaxCookieAge),
    maxAge: MaxCookieAge
  });
};
