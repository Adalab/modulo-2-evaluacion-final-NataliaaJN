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



//               COGER DATOS DEL API           //
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


//        MOSTRAR RESULTADOS DE BÚSQUEDA            //

// Función para generar HTML
const getResultsHtmlCode = (eachResult) => {
  let resultHtmlCode = '';
  if(eachResult.image_url === null){
    resultHtmlCode+= `  <li>
                          <img src='https://via.placeholder.com/210x295/ffffff/666666/?text=${eachResult.title}'; alt='${eachResult.title}'>
                          <h2 data-title= "title">${eachResult.title}</h2>  
                        </li>`;

  } else{
    resultHtmlCode+= ` <li>
                        <img src='${eachResult.image_url}' alt='${eachResult.title}'>
                        <h2 data-title= "title">${eachResult.title}</h2>  
                    </li>`;

  }
  return resultHtmlCode;
};

// Función para pintar los resultados
const renderResults = () => {
  let resultsCode= '';
  // para cada resultado del array
  for (const eachResult of seriesResults){
    resultsCode += getResultsHtmlCode(eachResult); // le paso el nuevo código que se tiene que generar
  }
  resultsList.innerHTML += resultsCode;
  // escucho eventos
  listenGetSearch();
};

// Escuchar evento para pintar resultados
const listenGetSearch = (event) =>{
  event.preventDefault();
  const searchTerm = searchInput.value; //.trim();

  // solo si la longitud de lo que introduzca el usuario es mayor de 3, ejecuta la función
  if(searchTerm.length >= 3){
    getApiData();
    renderResults();
  } else{ //si no...
    seriesSearchResults.innerHTML= `
    <h2 class="resultsSection__seriesTitle">Resultados</h2>
    <p> Debes introducir una búqueda válida </p>
  `; // debe introducir una búsqueda válida
    resultsList.innerHTML= ''; // el contenido de resultados se queda vacío
  }
  renderResults();

};

// Listener para el botón de buscar
searchBtn.addEventListener('click', listenGetSearch);


