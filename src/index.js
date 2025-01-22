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

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__error',
  errorClass: 'popup__error_visible'
};

function clearValidation(formElement, validationSettings) {
  const inputList = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
  const buttonElement = formElement.querySelector(validationSettings.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, validationSettings);
  inputList.forEach((inputElement) => hideInputError(formElement, inputElement, validationSettings));
}

function enableValidation(validationSettings) {
  const formList = Array.from(document.querySelectorAll(validationSettings.formSelector));
  formList.forEach(formElement => setEventListeners(formElement, validationSettings));
}

function setEventListeners(formElement, validationSettings) {
  const inputList = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
  const buttonElement = formElement.querySelector(validationSettings.submitButtonSelector);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement, validationSettings);
      toggleButtonState(inputList, buttonElement, validationSettings);
    });
  });
}

function toggleButtonState(inputList, buttonElement, validationSettings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationSettings.inactiveButtonClass);
  }
  else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationSettings.inactiveButtonClass);
  }
}

function hasInvalidInput(inputList) {
  return inputList.some(inputElement => !inputElement.validity.valid);
}

function isValid(formElement, inputElement, validationSettings) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, validationSettings, getValidationMessage(inputElement));
  } 
  else {
    hideInputError(formElement, inputElement, validationSettings);
  }
}

function getValidationMessage(inputElement) {
  if (inputElement.validity.patternMismatch) {
    return "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
  }
  else {
    return inputElement.validationMessage;
  } 
}

function showInputError(formElement, inputElement, validationSettings, errorMessage) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add('popup__input_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationSettings.errorClass);
}

function hideInputError(formElement, inputElement, validationSettings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove('popup__input_error');
  errorElement.classList.remove(validationSettings.errorClass);
  errorElement.textContent = '';
}; 

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
  clearValidation(document.forms['edit-profile'], validationSettings);
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

enableValidation(validationSettings);