import './index.css';
import { createCard, deleteCard, likeButtonHandler } from './components/card.js';
import { openPopup, closePopup } from './components/popup.js'
import { enableValidation, clearValidation } from './validation.js'
import { apiConfigInit, getUserData, getCards, patchUserData, addCard } from './api.js'

const placesListElement = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const popupElements = document.querySelectorAll('.popup');
const profileEditPopupElement = document.querySelector('.popup_type_edit');
const profileEditPopupNameInput = profileEditPopupElement.querySelector('.popup__input_type_name');
const profileEditPopupJobInput = profileEditPopupElement.querySelector('.popup__input_type_description');
const profileTitleElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');
const newCardPopupElement = document.querySelector('.popup_type_new-card');
const newCardForm = document.forms["new-place"];
const newCardPopupNameInput = newCardForm.elements['place-name'];
const newCardPopupLinkInput = newCardForm.elements['link'];
const imagePopupElement = document.querySelector('.popup_type_image');
const imagePopupImgElement = imagePopupElement.querySelector('.popup__image');
const imagePopupCaptionElement = imagePopupElement.querySelector('.popup__caption');

let userId;

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__error',
  errorClass: 'popup__error_visible'
}; 

function profileEditPopupSubmitHandler(evt) {
  evt.preventDefault();
  patchUserData({
    name: profileEditPopupNameInput.value,
    about: profileEditPopupJobInput.value
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      else {
        console.error('Failed to patch user data');
      }
    })
    .then((userData) => {
      profileTitleElement.textContent = userData.name;
      profileDescriptionElement.textContent = userData.about;
      closePopup(profileEditPopupElement);
    })
    .catch((error) => console.log(error));
}

function newCardPopupSubmitHandler(evt) {
  evt.preventDefault();
  const cardData = {
    name: newCardPopupNameInput.value,
    link: newCardPopupLinkInput.value
  };
  addCard(cardData)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      else {
        console.error("Failed to add new card");
      }
    })
    .then((newCardData) => {
      renderCard(newCardData, {deleteCard, likeButtonHandler, imageClickEventHandler});
      newCardForm.reset();
      clearValidation(newCardForm, validationSettings);
      closePopup(newCardPopupElement);
    })
    .catch((error) => console.error(error));
}

function imageClickEventHandler(cardData) {
    imagePopupCaptionElement.textContent = cardData.name;
    imagePopupImgElement.src = cardData.link;
    imagePopupImgElement.alt = `${cardData.name} (фото)`;
    openPopup(imagePopupElement);
}

function renderCard(cardData, callbacks, method = "prepend") {
  const cardElement = createCard(cardData, callbacks);
  placesListElement[method](cardElement);
}

function renderUserData(userData) {
  document.querySelector('.profile__title').textContent = userData.name;
  document.querySelector('.profile__description').textContent = userData.about;
  document.querySelector('.profile__image').style.backgroundImage = `url(${userData.avatar})`;
}

profileEditButton.addEventListener('click', function(evt) {
  profileEditPopupNameInput.value = profileTitleElement.textContent;
  profileEditPopupJobInput.value = profileDescriptionElement.textContent;
  clearValidation(document.forms['edit-profile'], validationSettings);
  openPopup(profileEditPopupElement);
});

profileAddButton.addEventListener('click', function(evt) {
  openPopup(newCardPopupElement);
  clearValidation(newCardForm, validationSettings);
});

profileEditPopupElement.addEventListener('submit', profileEditPopupSubmitHandler);
newCardPopupElement.addEventListener('submit', newCardPopupSubmitHandler);

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
    responses[0].json().then((userData) =>{
      userId = userData['_id'];
      renderUserData(userData);
    });
    responses[1].json().then((initialCards) =>{
      for (const cardData of initialCards){
        renderCard(cardData, {deleteCard, likeButtonHandler, imageClickEventHandler}, "append");
      }
    });
  })
  .catch((error) => console.log(error));