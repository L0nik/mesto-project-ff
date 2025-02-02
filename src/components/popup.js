
function openPopup(popupElement) {
  popupElement.classList.add('popup_is-opened');
  popupElement.addEventListener('keydown', popupKeydownEventHandler);
  const popupCloseButtonElement = popupElement.querySelector('.popup__close');
  popupCloseButtonElement.focus();
  popupElement.focus();
}

function closePopup(popupElement) {
  popupElement.classList.remove('popup_is-opened');
  popupElement.removeEventListener('keydown', popupKeydownEventHandler);
}

function changeSubmitButtonState(popupElement, state) {
  const submitButtonElement = popupElement.querySelector('[type="submit"]');
  if (typeof(submitButtonElement) === 'undefined') {
    return;
  }
  const dataAttributeName = 'content' + state;
  submitButtonElement.textContent = submitButtonElement.dataset[dataAttributeName];
}

function popupKeydownEventHandler(evt) {
  if (evt.key === 'Escape') {
    const popupElement = evt.target.closest('.popup');
    closePopup(popupElement);
  }
}

module.exports = {
  openPopup, closePopup, changeSubmitButtonState
}