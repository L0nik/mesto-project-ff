
const cardTemplate = document.querySelector('#card-template').content;

function createCardElement(cardData, isOwner, callbacks) {

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

  if (isOwner) {
    cardDeleteButtonElement.addEventListener('click', (evt) => {
      callbacks.deleteCard(cardData._id)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }

          return Promise.reject(`Error: ${response.status}`);
        })
        .then((res) => callbacks.deleteCardElement(evt))
        .catch((error) => console.error(error));
    });
  }
  else {
    cardDeleteButtonElement.style.display = 'none'; 
  }

  cardImageElement.addEventListener('click', (evt) => callbacks.imageClickEventHandler(cardData));
  cardLikeButtonElement.addEventListener('click', callbacks.likeButtonHandler);

  return cardElement;

}

function deleteCardElement(event) {
  const cardElement = event.target.closest('.places__item');
  cardElement.remove();
}

function likeButtonHandler(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

module.exports = {
  createCardElement, deleteCardElement, likeButtonHandler
}