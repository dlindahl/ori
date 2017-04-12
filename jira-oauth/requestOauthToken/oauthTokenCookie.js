/*
 * Creates a cookie used to temporarily store the OAuth Tokens during the
 * redirect process. Expires after 5 minutes.
*/
module.exports = function oauthTokenCookie(event, tokens) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5).toGMTString();
  return `oauthToken=${tokens.oauthToken}; oauthTokenSecret=${tokens.oauthTokenSecret}; domain=${event.headers['Host']}; expires=${expiresAt};`;
};
