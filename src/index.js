import './index.css';
import { initialCards } from './cards.js';

const cardTemplate = document.querySelector('#card-template').content;
const placesListElement = document.querySelector('.places__list');
const profileEditButtonElement = document.querySelector('.profile__edit-button');
const profileAddButtonElement = document.querySelector('.profile__add-button');

function createCard(cardData, deleteCardCallback) {
  
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleElement = cardElement.querySelector('.card__title');
  const cardImageElement = cardElement.querySelector('.card__image');
  const cardDeleteButtonElement = cardElement.querySelector('.card__delete-button');

  cardTitleElement.textContent = cardData.name;
  cardImageElement.src = cardData.link;
  cardImageElement.alt = `${cardData.name} (фото)`;

  cardImageElement.addEventListener('click', function() {
    const imagePopupElement = document.querySelector('.popup_type_image');
    openPopup(imagePopupElement);
  });
  cardDeleteButtonElement.addEventListener('click', deleteCardCallback);

  return cardElement;

}

function deleteCard(event) {
  const cardElement = event.target.closest('.places__item');
  cardElement.remove();
}

for (const cardData of initialCards){
  placesListElement.append(createCard(cardData, deleteCard));
}

function openPopup(popupElement) {
  popupElement.classList.add('popup_is-opened');
  popupElement.addEventListener('keydown', popupKeydownEventHandler);
  const popupCloseButtonElement = popupElement.querySelector('.popup__close');
  popupCloseButtonElement.addEventListener('click', (evt) => closePopup(popupElement));
  popupCloseButtonElement.focus();
}

function closePopup(popupElement) {
  popupElement.classList.remove('popup_is-opened');
  popupElement.removeEventListener('keydown', popupKeydownEventHandler);
}

function popupKeydownEventHandler(evt) {
  const popupElement = evt.target.closest('.popup');
  if (evt.key === 'Escape') {
    closePopup(popupElement);
  }
}

function documentClickEventHandler(evt) {
  const imagePopupElement = document.querySelector('.popup_type_image');
  if (evt.target === imagePopupElement) {
      closePopup(imagePopupElement);
  }
}

function profileEditPopupSubmitHandler(evt, profileEditPopupElement) {
  evt.preventDefault();
  const name = evt.target.querySelector('.popup__input_type_name').value;
  const job = evt.target.querySelector('.popup__input_type_description').value;
  document.querySelector('.profile__title').textContent = name;
  document.querySelector('.profile__description').textContent = job;
  closePopup(profileEditPopupElement);
}

profileEditButtonElement.addEventListener('click', function(evt) {
  const profileEditPopupElement = document.querySelector('.popup_type_edit');
  const nameInput = profileEditPopupElement.querySelector('.popup__input_type_name');
  const jobInput = profileEditPopupElement.querySelector('.popup__input_type_description');
  nameInput.value = document.querySelector('.profile__title').textContent;
  jobInput.value = document.querySelector('.profile__description').textContent;
  profileEditPopupElement.addEventListener('submit', (evt) => profileEditPopupSubmitHandler(evt, profileEditPopupElement));
  openPopup(profileEditPopupElement);
});

profileAddButtonElement.addEventListener('click', function(evt) {
  const newCardPopupElement = document.querySelector('.popup_type_new-card');
  openPopup(newCardPopupElement);
});

document.addEventListener('click', documentClickEventHandler);
