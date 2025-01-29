
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

function sendRequest(method, resource, body = {}) {

  const options = {
    method: method,
    headers: {
      authorization: Config.token,
      'Content-Type': 'application/json'
    },
  };

  //options.headers = Object.assign(options.headers, headers);

  if (Object.keys(body).length !== 0) {
    options.body = JSON.stringify(body);
  }

  return fetch(`${Config.host}/${Config.apiVersion}/${Config.cohortId}/${resource}`, options);
}

function getUserData() {
  const method = 'GET';
  const resource = 'users/me';
  return sendRequest(method, resource);
}

function getCards() {
  const method = 'GET';
  const resource = 'cards';
  return sendRequest(method, resource);
}

function patchUserData(userData) {
  const method = 'PATCH';
  const resource = 'users/me';
  return sendRequest(method, resource, userData);
}

function addCard(cardData) {
  const method = 'POST';
  const resource = 'cards';
  return sendRequest(method, resource, cardData);
}

function deleteCard(id) {
  const method = 'DELETE';
  const resource = `cards/${id}`;
  return sendRequest(method, resource);
}

module.exports = {
  apiConfigInit, getUserData, getCards, patchUserData, addCard, deleteCard
}