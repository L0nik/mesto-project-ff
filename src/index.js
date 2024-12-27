import './index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, cardClickEventhandler } from './components/card.js';
import { openPopup, closePopup } from './components/popup.js'

const placesListElement = document.querySelector('.places__list');
const profileEditButtonElement = document.querySelector('.profile__edit-button');
const profileAddButtonElement = document.querySelector('.profile__add-button');

for (const cardData of initialCards){
  placesListElement.append(createCard(cardData, deleteCard, cardClickEventhandler, imageClickEventHandler));
}

function documentClickEventHandler(evt) {
  const imagePopupElement = document.querySelector('.popup_type_image');
  if (evt.target === imagePopupElement) {
      closePopup(imagePopupElement);
  }
}

function profileEditPopupSubmitHandler(evt) {
  evt.preventDefault();
  const profileEditPopupElement = document.querySelector('.popup_type_edit');
  const name = evt.target.querySelector('.popup__input_type_name').value;
  const job = evt.target.querySelector('.popup__input_type_description').value;
  document.querySelector('.profile__title').textContent = name;
  document.querySelector('.profile__description').textContent = job;
  closePopup(profileEditPopupElement, profileEditPopupSubmitHandler);
}

function newCardPopupSubmitHandler(evt) {
  evt.preventDefault();
  const newCardPopupElement = document.querySelector('.popup_type_new-card');
  const newCardForm = newCardPopupElement.querySelector('.popup__form');
  const name = newCardForm.elements['place-name'].value;
  const link = newCardForm.elements['link'].value;
  placesListElement.append(createCard({name, link}, deleteCard, cardClickEventhandler, imageClickEventHandler));
  newCardForm.reset();
  closePopup(newCardPopupElement);
}

function imageClickEventHandler(evt) {
    const imagePopupElement = document.querySelector('.popup_type_image');
    const popupImage = imagePopupElement.querySelector('.popup__image');
    const popupCaption = imagePopupElement.querySelector('.popup__caption');
    const cardElement = evt.target.closest('.card');
    popupCaption.textContent = cardElement.querySelector('.card__title').textContent;
    popupImage.src = evt.target.src;
    popupImage.alt = `${popupCaption.textContent} (фото)`;
    openPopup(imagePopupElement);
}

profileEditButtonElement.addEventListener('click', function(evt) {
  const profileEditPopupElement = document.querySelector('.popup_type_edit');
  const nameInput = profileEditPopupElement.querySelector('.popup__input_type_name');
  const jobInput = profileEditPopupElement.querySelector('.popup__input_type_description');
  nameInput.value = document.querySelector('.profile__title').textContent;
  jobInput.value = document.querySelector('.profile__description').textContent;
  profileEditPopupElement.addEventListener('submit', profileEditPopupSubmitHandler);
  openPopup(profileEditPopupElement);
});

profileAddButtonElement.addEventListener('click', function(evt) {
  const newCardPopupElement = document.querySelector('.popup_type_new-card');
  newCardPopupElement.addEventListener('submit', newCardPopupSubmitHandler);
  openPopup(newCardPopupElement);
});

document.addEventListener('click', documentClickEventHandler);
