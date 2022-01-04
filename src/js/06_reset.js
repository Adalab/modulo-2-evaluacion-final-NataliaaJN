'use strict';
//                     RESET FUNCTIONS                         //
// Función para resetear el contenido de la búsqueda y los resultados
const resetSearchAndResults = () => {
  containerResults.innerHTML = '';
};


//                        LISTENERS                            //

// Listener para resetear input y resultados de búsqueda
resetBtn.addEventListener('click', resetSearchAndResults);

// Listener para resetear favoritos
const trashIcon = document.querySelector('.js-trashIcon');
trashIcon.addEventListener('click', () =>{
  let favouritesListStorage = JSON.parse(getFavouritesFromLocalStorage());
  favouritesListStorage.forEach(eachFavourite => removeFavouriteToLocalStorage(eachFavourite)); // reutilizo la función de eliminar favoritos y le paso como parámetro cada uno de los favoritos guardados en localStorage
  favouritesList.innerHTML= ''; // borra todo el contenido de la sección de favoritos (el código)
  
  counter= 0; // el contador de favoritos vuelve a 0
  renderFavouritesCounter();
});