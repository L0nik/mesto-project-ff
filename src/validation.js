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
  setValidationMessage(inputElement);
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, validationSettings);
  } 
  else {
    hideInputError(formElement, inputElement, validationSettings);
  }
}

function setValidationMessage(inputElement) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.patternMismatchError);
  }
  else {
    inputElement.setCustomValidity("");
  } 
}

function showInputError(formElement, inputElement, validationSettings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(validationSettings.inputErrorClass);
  errorElement.textContent = inputElement.validationMessage;
  errorElement.classList.add(validationSettings.errorClass);
}

function hideInputError(formElement, inputElement, validationSettings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationSettings.inputErrorClass);
  errorElement.classList.remove(validationSettings.errorClass);
  errorElement.textContent = '';
};

module.exports = {
  enableValidation, clearValidation
}