import './index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, cardClickEventhandler } from './components/card.js';
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
const newCardForm = newCardPopupElement.querySelector('.popup__form');
const newCardPopupNameInput = newCardForm.elements['place-name'];
const newCardPopupLinkInput = newCardForm.elements['link'];
const imagePopupElement = document.querySelector('.popup_type_image');
const imagePopupImgElement = imagePopupElement.querySelector('.popup__image');
const imagePopupCaptionElement = imagePopupElement.querySelector('.popup__caption');


function profileEditPopupSubmitHandler(evt) {
  evt.preventDefault();
  profileTitleElement.textContent = profileEditPopupNameInput.value;
  profileDescriptionElement.textContent = profileEditPopupJobInput.value;
  closePopup(profileEditPopupElement, profileEditPopupSubmitHandler);
}

function newCardPopupSubmitHandler(evt) {
  evt.preventDefault();
  const cardData = {
    name: newCardPopupNameInput.value,
    link: newCardPopupLinkInput.value
  };
  placesListElement.prepend(createCard(cardData, deleteCard, cardClickEventhandler, imageClickEventHandler));
  newCardForm.reset();
  closePopup(newCardPopupElement);
}

function imageClickEventHandler(evt) {
    const cardElement = evt.target.closest('.card');
    imagePopupCaptionElement.textContent = cardElement.querySelector('.card__title').textContent;
    imagePopupImgElement.src = evt.target.src;
    imagePopupImgElement.alt = `${imagePopupCaptionElement.textContent} (фото)`;
    openPopup(imagePopupElement);
}

function documentClickEventHandler(evt) {
  for (let popupElement of popupElements) {
    if (popupElement === evt.target){
      closePopup(evt.target);
    }
  }
}

for (const cardData of initialCards){
  placesListElement.append(createCard(cardData, deleteCard, cardClickEventhandler, imageClickEventHandler));
}

profileEditButton.addEventListener('click', function(evt) {
  profileEditPopupNameInput.value = profileTitleElement.textContent;
  profileEditPopupJobInput.value = profileDescriptionElement.textContent;
  profileEditPopupElement.addEventListener('submit', profileEditPopupSubmitHandler);
  openPopup(profileEditPopupElement);
});

profileAddButton.addEventListener('click', function(evt) {
  const newCardPopupElement = document.querySelector('.popup_type_new-card');
  newCardPopupElement.addEventListener('submit', newCardPopupSubmitHandler);
  openPopup(newCardPopupElement);
});

document.addEventListener('click', documentClickEventHandler);
