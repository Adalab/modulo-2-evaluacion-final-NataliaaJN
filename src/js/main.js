/* eslint-disable no-console */
'use strict';

// Recoger los elementos de HTML
const searchInput = document.querySelector('.js-searchInput');
//const searchInputValue= searchInput.value;

const searchBtn = document.querySelector('.js-searchBtn');

const seriesSearchResults = document.querySelector('.js-seriesResult');

const favoritesList = document.querySelector('.js-favoritesList');
const resultsList = document.querySelector('.js-resultsList');

const urlApi= `https://api.jikan.moe/v3/search/anime?q=`;


// variables globales

let seriesResults = []; // array para los resultados
let favourites= [];     // array para los favoritos



// 4º Coger datos del Api
const getApiData = () => {
  console.log(searchInput.value);
  fetch(`${urlApi}${searchInput.value}`)
    .then(response => response.json())
    .then(data => {
      console.log(data.results);
      // array con la lista de resultados
      seriesResults = data.results;
    //   renderResults();
    });
  // .catch(error=> console.warn(error.message));


};

getApiData();