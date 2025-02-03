
const cardTemplate = document.querySelector('#card-template').content;

function createCardElement(cardData, userId, callbacks) {

  const isOwner = cardData.owner._id === userId;


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

  const isLiked = cardData.likes.reduce(
    (accumulator, userData) => userData._id === userId ? true : accumulator,
    false
  );

  if (isLiked) {
    cardLikeButtonElement.classList.add('card__like-button_is-active');
  }

  if (isOwner) {
    cardDeleteButtonElement.addEventListener('click', (evt) => callbacks.eventHandlers.deleteCardElement(evt, cardData._id, callbacks));
  }
  else {
    cardDeleteButtonElement.style.display = 'none'; 
  }

  cardLikeButtonElement.addEventListener('click', (evt) => {
    callbacks.eventHandlers.likeButtonHandler(cardData._id, cardLikeButtonElement, numberOfLikesElement, callbacks);
  });

  cardImageElement.addEventListener('click', (evt) => callbacks.eventHandlers.imageClickEventHandler(cardData));

  return cardElement;

}

function deleteCardElement(evt, cardId, callbacks) {
  const cardElement = evt.target.closest('.places__item');
  const removeCardPopupElement = document.querySelector('.popup_type_remove-card');
  const removeCardForm = document.forms['remove-card'];
  removeCardForm.addEventListener('submit', (evt) => {
    deleteCardElementAfterConfirmation(evt, cardElement, cardId, callbacks)
      .then((res) => callbacks.popupMethods.closePopup(removeCardPopupElement))
      .catch((error) => console.log(error));
  });
  callbacks.popupMethods.openPopup(removeCardPopupElement);
}

function deleteCardElementAfterConfirmation(evt, cardElement, cardId, callbacks) {
  evt.preventDefault();
  return new Promise((resolve, reject) => {
    callbacks.apiMethods.cardDelete(cardId)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return Promise.reject(`Error: ${response.status}`);
    })
    .then((res) => {
      cardElement.remove();
      resolve('success');
    })
    .catch((error) => {
      console.error(error);
      reject(error);
    });
  });
}

function likeButtonHandler(cardId, cardLikeButtonElement, numberOfLikesElement, callbacks) {

  cardLikeButtonElement.classList.toggle('card__like-button_is-active');
  const isLiked = cardLikeButtonElement.classList.contains('card__like-button_is-active');

  const apiMethod = isLiked ? "cardPutLike" : "cardDeleteLike";
  callbacks.apiMethods[apiMethod](cardId)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return Promise.reject(`Error: ${response.status}`);
    })
    .then((cardData) => {
      numberOfLikesElement.textContent = cardData.likes.length;
    })
    .catch((error) => console.error(error));
}

module.exports = {
  createCardElement, deleteCardElement, likeButtonHandler
}