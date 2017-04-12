/*
 * An API endpoint whose sole purpose is to provide a place for Set-Cookie
 * headers to be honored, resulting in a cookie being set on the Lambda domain
 * and then redirecting to whatever URL has been provided in the `redirect`
 * querystring.
 */
module.exports = function sessionCreate(event) {
  return Promise.resolve({
    statusCode: 302,
    headers: {
      Location: event.queryStringParameters.redirect
    }
  });
};
