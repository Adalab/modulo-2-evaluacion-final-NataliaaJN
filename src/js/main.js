/* eslint-disable no-console */
'use strict';

// Recoger los elementos de HTML
const searchInput = document.querySelector('.js-searchInput');
const searchBtn = document.querySelector('.js-searchBtn');
const deleteFavsBtn = document.querySelector('.js-deleteFavsBtn');

const containerResults = document.querySelector('.container__result');
//const seriesSearchResults = document.querySelector('.js-seriesResult');
//const resultsList = document.querySelector('.js-resultsList');

const favoritesList = document.querySelector('.js-favoritesList');

const urlApi = `https://api.jikan.moe/v3/search/anime?q=`;

// variables globales
let favourites = []; // array para los favoritos

//            GUARDAR EN LOCALSTORAGE          //

const favouritesOnLocalStorage = 'favouritesList';

const getFavouritesFromLocalStorage = () => {
  return localStorage.getItem(favouritesOnLocalStorage);
};

const addFavouriteToLocalStorage = (favouriteToAdd) => {
  const favouriteObject = {
    id: favouriteToAdd.id,
    src: favouriteToAdd.querySelector('img').src,
    name: favouriteToAdd.querySelector('h2').innerHTML,
  };
  let favouritesListStorage = JSON.parse(getFavouritesFromLocalStorage());
  if (!favouritesListStorage) {
    favouritesListStorage = [];
  }
  favouritesListStorage.push(favouriteObject);
  localStorage.setItem(
    favouritesOnLocalStorage,
    JSON.stringify(favouritesListStorage)
  );
};

const removeFavouriteToLocalStorage = (favouriteToRemove) => {
  let favouritesListStorage = JSON.parse(getFavouritesFromLocalStorage());
  const index = favouritesListStorage.findIndex(
    (favourite) => favourite.id === favouriteToRemove.id
  );
  if (index !== -1) {
    favouritesListStorage.splice(index, 1);
  }
  localStorage.setItem(
    favouritesOnLocalStorage,
    JSON.stringify(favouritesListStorage)
  );
};

//               COGER DATOS DEL API           //
const getApiData = (searchInputValue) => {
  return fetch(`${urlApi}${searchInputValue}`)
    .then((response) => response.json())
    .then((data) => data.results);
  // .catch(error=> console.warn(error.message));
};

//        MOSTRAR RESULTADOS DE BÚSQUEDA            //

// Función para generar HTML
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

const removeFavourite = (liHtml) => {
  favoritesList.removeChild(liHtml);
  liHtml.classList.add('noSelectSerie');
  removeFavouriteToLocalStorage(liHtml);
};

// Añadir a la lista de favoritos
const addFavourite = (liHtml) => {
  //Comprobamos que el nodo no esté en favoritos
  //Convertimos NodeList a Array con el método estático from
  const indexOnFavourites = Array.from(favoritesList.childNodes).findIndex(
    (favourite) => favourite.id === liHtml.id
  );
  liHtml.style.border = '1px solid aquamarine';
  liHtml.style.color = 'aquamarine';

  if (indexOnFavourites !== -1) {
    return;
  }

  //Clonamos el nodo para añadirlo en favoritos
  const clonedLiHtml = liHtml.cloneNode(true);
  clonedLiHtml.style.border = 'transparent';
  clonedLiHtml.style.color = 'white';
  clonedLiHtml.style.listStyleType = 'none';

  const contentDeleteButton = document.createTextNode('X');
  const deleteButton = document.createElement('button');
  deleteButton.appendChild(contentDeleteButton);
  const deleteBtn = clonedLiHtml.appendChild(deleteButton);
  deleteBtn.style.backgroundColor = 'red';
  deleteBtn.style.color = 'white';
  deleteBtn.style.borderRadius = '50%';
  deleteBtn.style.padding = '5px';
  deleteBtn.style.cursor = 'pointer';
  /*
  clonedLiHtml.classList = '';
  clonedLiHtml.classList.add('la-clase-para-favoritos');
  */


  const favouritesLiElem = favoritesList.appendChild(clonedLiHtml);

  addFavouriteToLocalStorage(clonedLiHtml);

  favourites.push(favouritesLiElem);

  //Añadir el listener de remover favorito
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


//     LEER DEL LOCALSTORAGE     //

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

const renderFavouritesFromLocalStorage = () => {
  const favouritesObjectList = JSON.parse(getFavouritesFromLocalStorage());
  if (favouritesObjectList && favouritesObjectList.length > 0) {
    favouritesObjectList.forEach((favourite) => {
      favoritesList.append(createLiFromFavouriteObject(favourite));
    });
  }
};

const resetAllFavourites = () => {
  favourites = [];
};

// LISTENERS
// Evento click en cada resultado mostrado
for (let resultEl of containerResults.childNodes) {
  resultEl.addEventListener('click', addFavourite);
}

deleteFavsBtn.addEventListener('click', resetAllFavourites);

// start app
renderFavouritesFromLocalStorage();
