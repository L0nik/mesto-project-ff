
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

  if (Object.keys(body).length !== 0) {
    options.body = JSON.stringify(body);
  }

  return fetch(`${Config.host}/${Config.apiVersion}/${Config.cohortId}/${resource}`, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(`Error: ${response.status}`);
    });
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

function putLike(id) {
  const method = 'PUT';
  const resource = `cards/likes/${id}`;
  return sendRequest(method, resource);
}

function deleteLike(id) {
  const method = 'DELETE';
  const resource = `cards/likes/${id}`;
  return sendRequest(method, resource);
}

function changeAvatar(newAvatarData) {
  const method = 'PATCH';
  const resource = `users/me/avatar`;
  return sendRequest(method, resource, newAvatarData);
}

module.exports = {
  apiConfigInit, getUserData, getCards, patchUserData, addCard, deleteCard, putLike, deleteLike, changeAvatar
}