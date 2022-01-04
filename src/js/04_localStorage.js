'use strict';

//           PINTAR FAVORITOS GUARDADOS EN LOCALSTORE             //
// Función para crear el código HTML para los favoritos guardados en localStorage
const createLiFromFavouriteObject = (favouriteObject) => {
  const favouriteLi = document.createElement('li');
  favouriteLi.classList.add('js-newLiElement');
  favouriteLi.classList.add('localStorageLi');
  favouriteLi.id = favouriteObject.id;

  const img = document.createElement('img');
  img.src = favouriteObject.src;
  img.classList.add('localStorageLi__favouriteImg');
  favouriteLi.appendChild(img);

  const h3 = document.createElement('h3');
  h3.innerHTML = favouriteObject.name;
  h3.classList.add('localStorageLi__favouriteName');
  favouriteLi.appendChild(h3);

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML += `<i class="localStorageLi__deleteBtn--crossIcon far fa-times-circle"></i>`;
  deleteButton.classList.add('localStorageLi__deleteBtn');
  deleteButton.classList.add('js-remove-button');
  favouriteLi.appendChild(deleteButton);

  deleteButton.addEventListener('click', () => removeFavourite(favouriteLi));

  return favouriteLi;
};


// Función para pintar los favoritos guardados en localStorage
const renderFavouritesFromLocalStorage = () => {
  const favouritesObjectList = JSON.parse(getFavouritesFromLocalStorage());  // paso el objeto guardado a cadena de texto
  if (favouritesObjectList && favouritesObjectList.length > 0) {  // si existe el objeto de la lista de favoritos, y hay algo guardado
    favouritesObjectList.forEach((favourite) => {
      favouritesList.append(createLiFromFavouriteObject(favourite));
    });
    counter = favouritesObjectList.length;
    renderFavouritesCounter();
  }
};