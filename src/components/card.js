
const cardTemplate = document.querySelector('#card-template').content;

function createCard(cardData, callbacks) {

  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleElement = cardElement.querySelector('.card__title');
  const cardImageElement = cardElement.querySelector('.card__image');
  const cardDeleteButtonElement = cardElement.querySelector('.card__delete-button');
  const cardLikeButtonElement = cardElement.querySelector('.card__like-button');
  const numberOfLikesElement = cardElement.querySelector('.card__number-of-likes');

  cardTitleElement.textContent = cardData.name;
  cardImageElement.src = cardData.link;
  cardImageElement.alt = `${cardData.name} (фото)`;

  numberOfLikesElement.textContent = cardData.likes.length;

  cardImageElement.addEventListener('click', (evt) => callbacks.imageClickEventHandler(cardData));
  cardDeleteButtonElement.addEventListener('click', callbacks.deleteCard);
  cardLikeButtonElement.addEventListener('click', callbacks.likeButtonHandler);

  return cardElement;

}

function deleteCard(event) {
  const cardElement = event.target.closest('.places__item');
  cardElement.remove();
}

function likeButtonHandler(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

module.exports = {
  createCard, deleteCard, likeButtonHandler
}