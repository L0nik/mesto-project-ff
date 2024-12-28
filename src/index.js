import './index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, likeButtonHandler } from './components/card.js';
import { openPopup, closePopup } from './components/popup.js'

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


function profileEditPopupSubmitHandler(evt) {
  evt.preventDefault();
  profileTitleElement.textContent = profileEditPopupNameInput.value;
  profileDescriptionElement.textContent = profileEditPopupJobInput.value;
  closePopup(profileEditPopupElement);
}

function newCardPopupSubmitHandler(evt) {
  evt.preventDefault();
  const cardData = {
    name: newCardPopupNameInput.value,
    link: newCardPopupLinkInput.value
  };
  renderCard(cardData, {deleteCard, likeButtonHandler, imageClickEventHandler});
  newCardForm.reset();
  closePopup(newCardPopupElement);
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

for (const cardData of initialCards){
  renderCard(cardData, {deleteCard, likeButtonHandler, imageClickEventHandler}, "append");
}

profileEditButton.addEventListener('click', function(evt) {
  profileEditPopupNameInput.value = profileTitleElement.textContent;
  profileEditPopupJobInput.value = profileDescriptionElement.textContent;
  openPopup(profileEditPopupElement);
});

profileAddButton.addEventListener('click', function(evt) {
  openPopup(newCardPopupElement);
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