
const Config = {
  host: 'https://nomoreparties.co',
  apiVersion: 'v1',
  cohortId: '',
  token: ''
}

function apiConfigInit(cohortId, token) {
  Config.cohortId = cohortId;
  Config.token = token;
}

function sendRequest(method, resource, body) {
  const options = {
    method: method,
    headers: {
      authorization: Config.token
    },
  };

  if (method === 'POST' && typeof(body) !== 'undefined') {
    options.body = JSON.stringify({body});
  }

  return fetch(`${Config.host}/${Config.apiVersion}/${Config.cohortId}/${resource}`, options);
}

function getUserData() {
  const method = 'GET';
  const resource = 'users/me';
  return sendRequest(method, resource);
}

module.exports = {
  apiConfigInit, getUserData
}