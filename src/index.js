import './index.css';
import { createCardElement, deleteCardElement, likeButtonHandler } from './components/card.js';
import { openPopup, closePopup } from './components/popup.js'
import { enableValidation, clearValidation } from './validation.js'
import { apiConfigInit, getUserData, getCards, patchUserData, addCard, deleteCard, putLike, deleteLike, changeAvatar } from './api.js'

const placesListElement = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const popupElements = document.querySelectorAll('.popup');
const changeAvatarPopupElement = document.querySelector('.popup_type_change-avatar');
const changeAvatarForm = document.forms['change-avatar'];
const profileEditPopupElement = document.querySelector('.popup_type_edit');
const profileEditPopupNameInput = profileEditPopupElement.querySelector('.popup__input_type_name');
const profileEditPopupJobInput = profileEditPopupElement.querySelector('.popup__input_type_description');
const profileTitleElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');
const profileImageElement = document.querySelector('.profile__image');
const newCardPopupElement = document.querySelector('.popup_type_new-card');
const removeCardPopupElement = document.querySelector('.popup_type_remove-card');
const editProfileForm = document.forms['edit-profile'];
const removeCardForm = document.forms['remove-card'];
const newCardForm = document.forms['new-place'];
const newCardPopupNameInput = newCardForm.elements['place-name'];
const newCardPopupLinkInput = newCardForm.elements['link'];
const imagePopupElement = document.querySelector('.popup_type_image');
const imagePopupImgElement = imagePopupElement.querySelector('.popup__image');
const imagePopupCaptionElement = imagePopupElement.querySelector('.popup__caption');

const cardCallbacks = {
  eventHandlers: {deleteCardElement, likeButtonHandler, clickImageEventHandler, clickDeleteCardButtonHandler},
  apiMethods: {putLike, deleteLike}
};

let userId;

const cardToRemove = {
  cardId: null,
  cardElement: null
}

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_error',
  errorClass: 'popup__error_visible',
};

function changeSubmitButtonState(popupElement, state) {
  const submitButtonElement = popupElement.querySelector('[type="submit"]');
  if (typeof(submitButtonElement) === 'undefined') {
    return;
  }
  const dataAttributeName = 'content' + state;
  submitButtonElement.textContent = submitButtonElement.dataset[dataAttributeName];
}

function editProfilePopupSubmitHandler(evt) {
  evt.preventDefault();
  changeSubmitButtonState(profileEditPopupElement, 'Loading');
  patchUserData({
    name: profileEditPopupNameInput.value,
    about: profileEditPopupJobInput.value
  })
    .then((userData) => {
      profileTitleElement.textContent = userData.name;
      profileDescriptionElement.textContent = userData.about;
      closePopup(profileEditPopupElement);
    })
    .catch((error) => console.log(error))
    .finally(() => changeSubmitButtonState(profileEditPopupElement, 'Normal'));
}

function addNewCardPopupSubmitHandler(evt) {
  evt.preventDefault();
  changeSubmitButtonState(newCardPopupElement, 'Loading')
  const cardData = {
    name: newCardPopupNameInput.value,
    link: newCardPopupLinkInput.value
  };
  addCard(cardData)
    .then((newCardData) => {
      renderCard(newCardData, cardCallbacks);
      newCardForm.reset();
      clearValidation(newCardForm, validationSettings);
      closePopup(newCardPopupElement);
    })
    .catch((error) => console.error(error))
    .finally(() => changeSubmitButtonState(newCardPopupElement, 'Normal'));
}

function changeAvatarPopupSubmitHandler(evt) {
  evt.preventDefault();
  changeSubmitButtonState(changeAvatarPopupElement, 'Loading');
  const newAvatarData = {
    avatar: changeAvatarForm['link'].value
  };
  changeAvatar(newAvatarData)
    .then((userData) => {
      renderUserData(userData);
      changeAvatarForm.reset();
      clearValidation(changeAvatarForm, validationSettings);
      closePopup(changeAvatarPopupElement);
    })
    .catch((error) => console.error(error))
    .finally(() => changeSubmitButtonState(changeAvatarPopupElement, 'Normal'));
}

function clickImageEventHandler(cardData) {
    imagePopupCaptionElement.textContent = cardData.name;
    imagePopupImgElement.src = cardData.link;
    imagePopupImgElement.alt = `${cardData.name} (фото)`;
    openPopup(imagePopupElement);
}

function clickDeleteCardButtonHandler(cardId, cardElement) {
  cardToRemove.cardId = cardId;
  cardToRemove.cardElement = cardElement;
  openPopup(removeCardPopupElement);
}

function renderCard(cardData, callbacks, method = "prepend") {
  const cardElement = createCardElement(cardData, userId, callbacks);
  placesListElement[method](cardElement);
}

function renderUserData(userData) {
  profileTitleElement.textContent = userData.name;
  profileDescriptionElement.textContent = userData.about;
  profileImageElement.style.backgroundImage = `url(${userData.avatar})`;
}

profileEditButton.addEventListener('click', function(evt) {
  profileEditPopupNameInput.value = profileTitleElement.textContent;
  profileEditPopupJobInput.value = profileDescriptionElement.textContent;
  clearValidation(editProfileForm, validationSettings);
  openPopup(profileEditPopupElement);
});

profileAddButton.addEventListener('click', function(evt) {
  openPopup(newCardPopupElement);
  clearValidation(newCardForm, validationSettings);
});

profileImageElement.addEventListener('click', function(evt) {
  openPopup(changeAvatarPopupElement);
  clearValidation(changeAvatarForm, validationSettings);
});

changeAvatarPopupElement.addEventListener('submit', changeAvatarPopupSubmitHandler);
profileEditPopupElement.addEventListener('submit', editProfilePopupSubmitHandler);
newCardPopupElement.addEventListener('submit', addNewCardPopupSubmitHandler);

removeCardForm.addEventListener("submit", (evt) => {

  evt.preventDefault();

  deleteCard(cardToRemove.cardId)
    .then((res) => {
      cardToRemove.cardElement.remove();
      closePopup(removeCardPopupElement);
    })
    .catch((error) => console.error(error));

});

popupElements.forEach((popupElement) => {
  popupElement.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup_is-opened')) {
      closePopup(popupElement);
    }
    if (evt.target.classList.contains('popup__close')) {
      closePopup(popupElement)
    }
  })
})

enableValidation(validationSettings);
apiConfigInit('wff-cohort-31', '704e92ea-c623-4f71-b219-923161e177d0');

const userDataPromise = getUserData();
const initialCardsPromise = getCards();
Promise.all([userDataPromise, initialCardsPromise])
  .then((responses) => {
    const userData = responses[0];
    const initialCards = responses[1];
    userId = userData['_id'];
    renderUserData(userData);
    for (const cardData of initialCards){
      renderCard(cardData, cardCallbacks, "append");
    }
  })
  .catch((error) => console.log(error));