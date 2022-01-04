/* eslint-disable no-console */
'use strict';

//                      RECOGER LOS ELEMENTOS DE HTML                           //

const searchIcon = document.querySelector('.js-searchIcon');             // Icono de lupa para búsqueda
const searchInput = document.querySelector('.js-searchInput');           // Input de búsqueda
const searchBtn = document.querySelector('.js-searchBtn');               // Botón para buscar
const resetBtn = document.querySelector('.js-resetBtn');                 // Botón para resetear

const favouritesSection = document.querySelector('.js-favouritesSection');
const containerResults = document.querySelector('.js-containerResult');   // Contenedor del ul de resultados

const favouritesCounter = document.querySelector('.js-counter');         // Número para contador de favoritos
const starIcons = document.querySelectorAll('.js-starIcon');             // Icono de estrella
const favouritesList = document.querySelector('.js-favouritesList');     // ul que contiene la lista de resultados

const urlApi = `https://api.jikan.moe/v3/search/anime?q=`;               // url de búsqueda de la api


//                            VARIABLES GLOBALES                                 //
let favourites = []; // array para los favoritos
let counter= 0;

//                                FUNCIONES                                      //

//            CONTADOR DE FAVORITOS                         //
const renderFavouritesCounter = () => {
  favouritesCounter.innerHTML = `${counter}`;
};

//               GUARDAR EN LOCALSTORAGE                   //

const favouritesOnLocalStorage = 'favouritesList';  // Guardo el nombre clave
// Función para recoger los favoritos guardados en localStorage
const getFavouritesFromLocalStorage = () => {
  return localStorage.getItem(favouritesOnLocalStorage);  // Llamo a los datos guardados por el nombre clave
};

// Función para guardar los favoritos en el localStorage
const addFavouriteToLocalStorage = (favouriteToAdd) => {
  // Creo un objeto con lo que debe contener cada elemento que guardemos en favoritos
  const favouriteObject = {
    id: favouriteToAdd.id,
    src: favouriteToAdd.querySelector('img').src,
    name: favouriteToAdd.querySelector('h3').innerHTML,
  };
  let favouritesListStorage = JSON.parse(getFavouritesFromLocalStorage()); // Paso los datos guardados de string a su forma original
  if (!favouritesListStorage) {
    favouritesListStorage = [];
  }
  // Añado el objeto al array de favoritos guardados en localStorage
  favouritesListStorage.push(favouriteObject);
  localStorage.setItem(favouritesOnLocalStorage, JSON.stringify(favouritesListStorage)); // Cuando añado un favorito, guardo el array de favoritos en localStorage
};


// Función para eliminar favoritos del localStorage
const removeFavouriteToLocalStorage = (favouriteToRemove) => {
  let favouritesListStorage = JSON.parse(getFavouritesFromLocalStorage()); // Paso los datos guardados de string a su forma original
  // Compruebo si la serie ya está en favoritos:
  // 1º- busco el índice del favorito que coincida con el id del favorito que quiero borrar
  const index = favouritesListStorage.findIndex(favourite => favourite.id === favouriteToRemove.id);
  // 2º- si está en el array... (si no está, devuelve -1)
  if (index !== -1) {
    favouritesListStorage.splice(index, 1); // lo elimino de la lista de favoritos
  }
  localStorage.setItem(favouritesOnLocalStorage,JSON.stringify(favouritesListStorage)); // Cuando elimino un favorito, vuelvo a guardar el array de favoritos en localStorage
  counter--;
  renderFavouritesCounter();
};


//               COGER DATOS DEL API           //
const getApiData = (searchInputValue) => {
  return fetch(`${urlApi}${searchInputValue}`)
    .then((response) => response.json())
    .then((data) => data.results);
};


//        MOSTRAR RESULTADOS DE BÚSQUEDA            //

// Función para generar el código HTML que debe aparecer para cada resultado
const getResultsHtmlCode = (eachResult, isFavourite) => {
  let resultHtmlCode = '';
  if (eachResult.image_url === null) {
    resultHtmlCode += `<li id= "${eachResult.mal_id}" class= 'liResult js-newLiElement ${isFavourite? ' selected': ''}'>
                          <div class= 'liResult__imgContainer'>
                            <img class= 'liResult__imgContainer--img' src='https://via.placeholder.com/210x295/ffffff/666666/?text=${eachResult.title}' title='${eachResult.title}' alt='${eachResult.title}'>
                          </div>
                          <h3 class= 'liResult__title>${eachResult.title}</h3>
                        </li>`;
  } else {
    resultHtmlCode += `<li id= "${eachResult.mal_id}" class= 'liResult js-newLiElement${isFavourite? ' selected': ''}'>
                        <div class= 'liResult__imgContainer'>
                          <img class= 'liResult__imgContainer--img' src='${eachResult.image_url}' title='${eachResult.title}' alt='${eachResult.title}'>
                        </div>
                        <h3>${eachResult.title}</h3>
                    </li>`;
  }
  return resultHtmlCode;
};

// Función para pintar los resultados
const renderResults = (htmlElement, results) => {
  let resultsCode = '';
  const favouritesFromLocalStorage= JSON.parse(getFavouritesFromLocalStorage());
  // para cada resultado del array
  for (const eachResult of results) {
    const indexOfFavourite= favouritesFromLocalStorage.findIndex(favourite=> parseInt(favourite.id) === eachResult.mal_id);
    resultsCode += getResultsHtmlCode(eachResult, indexOfFavourite !== -1); // le paso el nuevo código que se tiene que generar
  }
  htmlElement.innerHTML += resultsCode;

};


//                  AÑADIR O ELIMINAR FAVORITOS                //

// Función para eliminar favoritos:

const removeFavourite = (liHtml) => {
  const favouriteListChild= Array.from(favouritesList.childNodes).find(favourite => favourite.id === liHtml.id);
  liHtml.classList.remove('selected');
  favouritesList.removeChild(favouriteListChild); // Elimina del ul de favoritos, los hijos li
  removeFavouriteToLocalStorage(liHtml); // Ejecuta la función que elimina un favorito del localStorage
};

// Función para añadir favoritos:
const addFavourite = (liHtml) => {
  //Comprobamos que el nodo no esté en favoritos
  //Convertimos NodeList a Array con el método estático from
  const indexOnFavourites = Array.from(favouritesList.childNodes).findIndex(favourite => favourite.id === liHtml.id);
  liHtml.classList.toggle('selected');

  if (indexOnFavourites !== -1) {
    return; //si ya está en favoritos, se sale de la función
  }

  //Clonamos el nodo para añadirlo en favoritos
  const clonedLiHtml = liHtml.cloneNode(true); // Clono el resultado (elemento li) creado al hacer una búsqueda
  clonedLiHtml.classList.add('clonedLiHtmlStyle');

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML+= `<i class="deleteBtn__crossIcon far fa-times-circle"></i>`;
  const deleteBtn = clonedLiHtml.appendChild(deleteButton);
  deleteBtn.classList.add('deleteBtn');
  deleteBtn.classList.add('js-remove-button');

  const favouritesLiElem = favouritesList.appendChild(clonedLiHtml); // A la lista ul de favoritos, le añado como hijo el li clonado
  addFavouriteToLocalStorage(clonedLiHtml); // Ejecuto la función declarada previamente, para guardarlo en el localStorage
  favourites.push(favouritesLiElem); // Añado los li al array de favoritos

  //Añadir el listener de eliminar favorito
  deleteBtn.addEventListener('click', () => removeFavourite(clonedLiHtml));
  counter++;
  renderFavouritesCounter();
};

const toggleFavourite = (liHtml) =>{
  if(liHtml.classList.contains('selected')){
    removeFavourite(liHtml);
  } else{
    addFavourite(liHtml);
  }
};

const addEventListenerToResults = () => {
  const resultsList = containerResults.querySelector('.js-resultsList');
  resultsList.childNodes.forEach((result) => {
    result.addEventListener('click', ()=> toggleFavourite(result));
  });
};

// Escuchar evento para pintar resultados
searchBtn.addEventListener('click', function (event) {
  event.preventDefault();
  const searchTerm = searchInput.value;
  if (searchTerm.length >= 3) {
    const listResults = document.createElement('ul');
    listResults.classList.add('resultsSection__containerResult--seriesList');
    listResults.classList.add('js-resultsList');
    containerResults.innerHTML = '';

    getApiData(searchTerm)
      .then((results) => {
        renderResults(listResults, results);
        containerResults.appendChild(listResults);
      })
      .then(() => {
        addEventListenerToResults();
      });
  } else {
    //si no...
    containerResults.innerHTML = '';
    containerResults.innerHTML = `<p> Debes introducir una búqueda válida </p>`; // debe introducir una búsqueda válida
  }
});

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
    counter= favouritesObjectList.length;
    renderFavouritesCounter();
  }
};

// Función para resetear el contenido de la búsqueda y los resultados
const resetSearchAndResults = () => {
  containerResults.innerHTML = '';
};

// Función para desplegar la sección de favoritos
const handleClickFavouritesCollapsable = () => {
  const resultsSection = document.querySelector('.js-seriesResult');
  favouritesSection.classList.toggle('collapsed');
  favouritesSection.classList.toggle('favoritesSection');
  resultsSection.classList.toggle('resultsSectionIfFavouritesOpen');
  resultsSection.classList.toggle('resultsSection');
};



//                                    LISTENERS                                   //
// Listener para mostrar el formulario en la versión móvil
searchIcon.addEventListener('click', () =>{
  searchInput.classList.toggle('header__form--searchInput');
  searchInput.classList.toggle('removeHiddenSearchInput');
  searchBtn.classList.toggle('header__form--btns--btnSearch');
  searchBtn.classList.toggle('btnsMobile__btnSearchMobile');
  resetBtn.classList.toggle('header__form--btns--btnReset');
  resetBtn.classList.toggle('btnsMobile__btnResetMobile');
});

// Listener en icono estrella para desplegar sección de favoritos
for (const star of starIcons){
  star.addEventListener('click', handleClickFavouritesCollapsable);
}

// Listener para resetear favoritos
const trashIcon = document.querySelector('.js-trashIcon');
trashIcon.addEventListener('click', () =>{
  let favouritesListStorage = JSON.parse(getFavouritesFromLocalStorage());
  favouritesListStorage.forEach(eachFavourite => removeFavouriteToLocalStorage(eachFavourite)); // reutilizo la función de eliminar favoritos y le paso como parámetro cada uno de los favoritos guardados en localStorage
  favouritesList.innerHTML= ''; // borra todo el contenido de la sección de favoritos (el código)
  counter= 0; // el contador de favoritos vuelve a 0
  renderFavouritesCounter();
});


// Listener para resetear input y resultados de búsqueda
resetBtn.addEventListener('click', resetSearchAndResults);

//                                    START APP                                   //
renderFavouritesFromLocalStorage();