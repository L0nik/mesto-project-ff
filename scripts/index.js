const cardTemplate = document.querySelector('#card-template').content;
const placesListElement = document.querySelector('.places__list');

function createCard(cardData, deleteCardCallback) {
  
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleElement = cardElement.querySelector('.card__title');
  const cardImageElement = cardElement.querySelector('.card__image');
  const cardDeleteButtonElement = cardElement.querySelector('.card__delete-button');

  cardTitleElement.textContent = cardData.name;
  cardImageElement.src = cardData.link;
  cardImageElement.alt = `${cardData.name} (фото)`;

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
