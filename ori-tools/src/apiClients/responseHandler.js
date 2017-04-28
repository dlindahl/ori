// Throw an error reflecting the error code, text, and detailed JSON error info
function processError(response) {
  return processResponse(response).then(data => {
    throw Error(
      `${response.status}: ${response.statusText} (${response.url} - ${JSON.stringify(data.errors)})`
    );
  });
}

// Returns JSON data for JSON responses, text data for non-JSON responses
function processResponse(response) {
  if (response.headers.has('content-type')) {
    const mimeType = response.headers.get('content-type');
    if (mimeType.includes('application/json;')) {
      return response.json();
    }
  }
  return response.text();
}

// Process various response types (success, failure, etc.)
module.exports = function responseHandler(response) {
  if (response.ok) {
    return processResponse(response);
  }
  if (response.status >= 200 && response.status < 300) {
    return processResponse(response);
  }
  if (response.status >= 300 && response.status < 400) {
    throw new Error('NotImplementedError: Redirection not yet implemented');
  }
  if (response.status >= 400 && response.status < 500) {
    return processError(response);
  }
  if (response.status >= 500 && response.status < 600) {
    return processError(response);
  }
};
