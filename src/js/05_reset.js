'use strict';

//                 RESET FUNCTIONS                //

// Función para resetear el contenido de la búsqueda y los resultados
const resetSearchAndResults = () => {
  containerResults.innerHTML = '';
};


//                   LISTENERS                   //

// Listener para resetear favoritos
const trashIcon = document.querySelector('.js-trashIcon');
trashIcon.addEventListener('click', () => {  // al hacer click en el icono de la basura
  favouritesList.childNodes.forEach(favourite => {
    deleteOnResultIfExists(favourite); // llamo a la función que borra el resultado si existe en los resultados de búsqueda, y le paso como parámetro el favorito (si existe el favorito en los resultados de búsqueda-> elimínalo)
    removeFavouriteToLocalStorage(favourite); // llamo a la función que elimina el favorito del localStorage
  });

  favouritesList.innerHTML = ''; // borra todo el contenido de la sección de favoritos (el código)
  counter = 0; // el contador de favoritos vuelve a 0
  renderFavouritesCounter();
});


// Listener para resetear input y resultados de búsqueda
resetBtn.addEventListener('click', resetSearchAndResults);