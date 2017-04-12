module.exports = function getEndpoint(event) {
  return event.headers['X-Forwarded-Proto'] +
    '://' +
    event.headers['Host'] +
    '/' +
    event.requestContext['stage'];
};
