module.exports = {
  openPopup, closePopup
}

function openPopup(popupElement) {
  popupElement.classList.add('popup_is-opened');
  popupElement.addEventListener('keydown', popupKeydownEventHandler);
  const popupCloseButtonElement = popupElement.querySelector('.popup__close');
  popupCloseButtonElement.addEventListener('click', (evt) => closePopup(popupElement));
  popupCloseButtonElement.focus();
}

function closePopup(popupElement, submitEventHandler) {
  popupElement.classList.remove('popup_is-opened');
  popupElement.removeEventListener('keydown', popupKeydownEventHandler);
  popupElement.removeEventListener('submit', submitEventHandler);
}

function popupKeydownEventHandler(evt) {
  const popupElement = evt.target.closest('.popup');
  if (evt.key === 'Escape') {
    closePopup(popupElement);
  }
}