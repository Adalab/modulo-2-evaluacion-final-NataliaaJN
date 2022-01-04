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
