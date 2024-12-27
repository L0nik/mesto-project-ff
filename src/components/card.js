module.exports = {
  createCard, deleteCard, cardClickEventhandler
}

const cardTemplate = document.querySelector('#card-template').content;

function createCard(cardData, deleteCardCallback, likeCardCallback, imageClickEventHandler) {
  
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleElement = cardElement.querySelector('.card__title');
  const cardImageElement = cardElement.querySelector('.card__image');
  const cardDeleteButtonElement = cardElement.querySelector('.card__delete-button');
  const cardLikeButtonElement = cardElement.querySelector('.card__like-button');

  cardTitleElement.textContent = cardData.name;
  cardImageElement.src = cardData.link;
  cardImageElement.alt = `${cardData.name} (фото)`;

  cardImageElement.addEventListener('click', imageClickEventHandler);
  cardDeleteButtonElement.addEventListener('click', deleteCardCallback);
  cardLikeButtonElement.addEventListener('click', likeCardCallback);

  return cardElement;

}

function deleteCard(event) {
  const cardElement = event.target.closest('.places__item');
  cardElement.remove();
}

function cardClickEventhandler(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}