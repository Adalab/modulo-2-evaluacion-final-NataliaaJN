/* eslint-disable no-console */
'use strict';
// Recoger los elementos de HTML
const searchInput = document.querySelector('.js-searchInput');
const searchBtn = document.querySelector('.js-searchBtn');
const containerResults = document.querySelector('.container__result');
const seriesSearchResults = document.querySelector('.js-seriesResult');
const favoritesList = document.querySelector('.js-favoritesList');
const resultsList = document.querySelector('.js-resultsList');
const urlApi = `https://api.jikan.moe/v3/search/anime?q=`;
// variables globales
let seriesResults = []; // array para los resultados
let favourites = []; // array para los favoritos
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
    resultHtmlCode += `  <li data-name= "${eachResult.title}" class= 'js-newLiElement'>
                          <img src='https://via.placeholder.com/210x295/ffffff/666666/?text=${eachResult.title}'; alt='${eachResult.title}'>
                          <h2>${eachResult.title}</h2>  
                        </li>`;
  } else {
    resultHtmlCode += ` <li data-name= "${eachResult.title}" class= 'js-newLiElement'>
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
  // escucho eventos
  // listenGetSearch();
};
searchBtn.addEventListener('click', function (event) {
  event.preventDefault();
  const searchTerm = searchInput.value;
  if (searchTerm.length >= 3) {
    const listResults = document.createElement('ul');
    listResults.classList.add('resultsSection__seriesList');
    listResults.classList.add('js-resultsList');
    containerResults.innerHTML = '';

    getApiData(searchTerm).then(results => {
      renderResults(listResults, results);
      containerResults.appendChild(listResults);
    });

  } else { //si no...
    containerResults.innerHTML = '';
    containerResults.innerHTML = `<p> Debes introducir una búqueda válida </p>`; // debe introducir una búsqueda válida
  }
});

// Escuchar evento para pintar resultados
// añadir a la lista de favoritos el elemento que coincide con el title clickado
const addFavourite = (ev) => {
  const selectSerieTitle = ev.currenTarget.dataset.title;
  console.log(selectSerieTitle);
  // buscar en los resultados el elemento que coincide con el title clickado
  let foundFavourite = favourites.find(
    (favourite) => favourite.title === selectSerieTitle
  );
  // si no lo he encontrado en la lista de favoritos
  if (foundFavourite === undefined) {
    let foundSerie = seriesResults.find(
      (serie) => serie.title === selectSerieTitle
    ); //busco la serie clickada en los resultados
    // y lo añado a favoritos
    favourites.push(foundSerie);
    foundFavourite.classList.add('selectSerie');
  } else {
    //busco el índice del elemento clickado
    const isFavourite = favourites.findIndex(
      (favourite) => favourite.title === selectSerieTitle
    );
    favourites.splice(isFavourite, 1); //Lo borro de la lista de favoritos
  }
  //setInLocalStorage();
  renderResults();
  //renderFavourites();// pintar los favoritos
};
// Escuchar evento click en resultados: 1º-crear clase para los resultados
const listenAddResultsToFavourites = () => {
  const liResults = document.querySelectorAll('.js-newLiElement');
  // creo un listener para cada resultado
  for (const eachResult of liResults) {
    eachResult.addEventListener('click', addFavourite);
  }
  // addFavourite();
};
listenAddResultsToFavourites();
//               HACER FAVORITOS            //
const getFavouriteHtmlCode = (favourite) => {
  let favouriteCode = '';
  favouriteCode += `<li class= "selectSerie">
                       <img src='${favourite.image_url}' alt='${favourite.title}'>
                        <h2 data-title= "title">${favourite.title}</h2>  
                    </li>
    `;
  return favouriteCode;
};
//     Guardar en localStorage     //
const setInLocalStorage = () => {
  // guardar los favoritos
  const stringifyFavourites = JSON.stringify(favourites); // pasar el objeto a cadena de  texto
  localStorage.setItem('favourites', stringifyFavourites);
};
// Pintar favoritos
const renderFavourites = () => {
  favoritesList.innerHTML = ''; // limpiamos
  for (const favourite of favourites) {
    favoritesList.innerHTML += getFavouriteHtmlCode(favourite);
  }
  // addFavourite();
};
// Listener para el botón de buscar
// searchBtn.addEventListener('click', listenGetSearch);
// start app
renderFavourites();
