/* eslint-disable no-console */
'use strict';

//                      RECOGER LOS ELEMENTOS DE HTML                           //

const searchInput = document.querySelector('.js-searchInput');           // Input de búsqueda
const searchBtn = document.querySelector('.js-searchBtn');               // Botón para buscar
const resetBtn = document.querySelector('.js-resetBtn');                 // Botón para resetear

const containerResults = document.querySelector('.container__result');   // Contenedor del ul de resultados

const favouritesList = document.querySelector('.js-favouritesList');     // ul que contiene la lista de resultados

const urlApi = `https://api.jikan.moe/v3/search/anime?q=`;               // url de búsqueda de la api


//                            VARIABLES GLOBALES                                 //
let favourites = []; // array para los favoritos

//                                FUNCIONES                                      //

//               GUARDAR EN LOCALSTORAGE                   //

const favouritesOnLocalStorage = 'favouritesList';  // Guardo el nombre clave

const getFavouritesFromLocalStorage = () => {
  return localStorage.getItem(favouritesOnLocalStorage);  // Llamo a los datos guardados por el nombre clave
};

// Función para guardar los favoritos en el localStorage
const addFavouriteToLocalStorage = (favouriteToAdd) => {
  // Creo un objeto con lo que debe contener cada elemento que guardemos en favoritos
  const favouriteObject = {
    id: favouriteToAdd.id,
    src: favouriteToAdd.querySelector('img').src,
    name: favouriteToAdd.querySelector('h2').innerHTML,
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
};


//               COGER DATOS DEL API           //
const getApiData = (searchInputValue) => {
  return fetch(`${urlApi}${searchInputValue}`)
    .then((response) => response.json())
    .then((data) => data.results);
  // .catch(error=> console.warn(error.message));
};


//        MOSTRAR RESULTADOS DE BÚSQUEDA            //

// Función para generar el código HTML que debe aparecer para cada resultado
const getResultsHtmlCode = (eachResult) => {
  let resultHtmlCode = '';
  if (eachResult.image_url === null) {
    resultHtmlCode += `<li id= "${eachResult.mal_id}" class= 'js-newLiElement'>
                          <img src='https://via.placeholder.com/210x295/ffffff/666666/?text=${eachResult.title}'; alt='${eachResult.title}'>
                          <h2>${eachResult.title}</h2>
                        </li>`;
  } else {
    resultHtmlCode += `<li id= "${eachResult.mal_id}" class= 'js-newLiElement'>
                        <img src='${eachResult.image_url}' alt='${eachResult.title}'>
                        <h2>${eachResult.title}</h2>
                    </li>`;
  }
  return resultHtmlCode;
};

// Función para pintar los resultados
const renderResults = (htmlElement, results) => {
  let resultsCode = '';
  // para cada resultado del array
  for (const eachResult of results) {
    resultsCode += getResultsHtmlCode(eachResult); // le paso el nuevo código que se tiene que generar
  }
  htmlElement.innerHTML += resultsCode;
};


//                  AÑADIR O ELIMINAR FAVORITOS                //

// Función para eliminar favoritos:
const removeFavourite = (liHtml) => {
  favouritesList.removeChild(liHtml); // Elimina del ul de favoritos, los hijos li
  //liHtml.classList.add('noSelectSerie');                            // ***** NO FUNCIONA*******!!
  removeFavouriteToLocalStorage(liHtml); // Ejecuta la función que elimina un favorito del localStorage
};

// Función para añadir favoritos:
const addFavourite = (liHtml) => {
  //Comprobamos que el nodo no esté en favoritos
  //Convertimos NodeList a Array con el método estático from
  const indexOnFavourites = Array.from(favouritesList.childNodes).findIndex(favourite => favourite.id === liHtml.id);
  liHtml.classList.toggle('selected');

  if (indexOnFavourites !== -1) {
    return; //si está en favoritos, se sale de la función
  }

  //Clonamos el nodo para añadirlo en favoritos
  const clonedLiHtml = liHtml.cloneNode(true); // Clono el resultado (elemento li) creado al hacer una búsqueda
  clonedLiHtml.classList.add('clonedLiHtmlStyle');


  const deleteButton = document.createElement('button');
  deleteButton.innerHTML= 'X';
  const deleteBtn = clonedLiHtml.appendChild(deleteButton);
  deleteBtn.classList.add('js-remove-button');



  const favouritesLiElem = favouritesList.appendChild(clonedLiHtml); // A la lista ul de favoritos, le añado como hijo el li clonado
  addFavouriteToLocalStorage(clonedLiHtml); // Ejecuto la función declarada previamente, para guardarlo en el localStorage
  favourites.push(favouritesLiElem); // Añado los li al array de favoritos

  //Añadir el listener de eliminar favorito
  deleteBtn.addEventListener('click', () => removeFavourite(clonedLiHtml));
  liHtml.addEventListener('click', () => removeFavourite(clonedLiHtml));
};

const addEventListenerToResults = () => {
  const resultsList = containerResults.querySelector('.js-resultsList');
  resultsList.childNodes.forEach((result) => {
    result.addEventListener('click', () => addFavourite(result));
  });
};

// Escuchar evento para pintar resultados
searchBtn.addEventListener('click', function (event) {
  event.preventDefault();
  const searchTerm = searchInput.value;
  if (searchTerm.length >= 3) {
    const listResults = document.createElement('ul');
    listResults.classList.add('resultsSection__seriesList');
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
// Función para crear el código HTML para los favoritos guardados
const createLiFromFavouriteObject = (favouriteObject) => {
  const favouriteLi = document.createElement('li');
  favouriteLi.classList.add('js-newLiElement');
  favouriteLi.id = favouriteObject.id;

  const img = document.createElement('img');
  img.src = favouriteObject.src;
  favouriteLi.appendChild(img);

  const h2 = document.createElement('h2');
  h2.innerHTML = favouriteObject.name;
  favouriteLi.appendChild(h2);

  const deleteButton = document.createElement('button');
  //const icon = document.createElement('i');
  // icon.classList.add('fas fa-cross');
  deleteButton.innerHTML = 'X';
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
  }
};

const resetSearchAndResults = () => {
  containerResults.innerHTML = '';
};


//                                    LISTENERS                                   //

// Evento click en cada resultado mostrado
for (let resultEl of containerResults.childNodes) {
  resultEl.addEventListener('click', addFavourite);
}

resetBtn.addEventListener('click', resetSearchAndResults);

//                                    START APP                                   //
renderFavouritesFromLocalStorage();