'use strict';

// Recoger los elementos de HTML
const searchInput = document.querySelector('.js-searchInput');
const searchBtn = document.querySelector('.js-searchBtn');

const containerResults = document.querySelector('.container__result');
//const seriesSearchResults = document.querySelector('.js-seriesResult');
//const resultsList = document.querySelector('.js-resultsList');

const favoritesList = document.querySelector('.js-favoritesList');

const urlApi = `https://api.jikan.moe/v3/search/anime?q=`;



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
  // escucho eventos
  // listenGetSearch();

};

const removeFavourite = (liHtml) => {
  favoritesList.removeChild(liHtml);
};

// Añadir a la lista de favoritos
const addFavourite = (liHtml) => {
  //Comprobamos que el nodo no esté en favoritos
  //Convertimos NodeList a Array con el método estático from
  const indexOnFavourites = Array.from(favoritesList.childNodes).findIndex(favourite => favourite.id === liHtml.id);

  if (indexOnFavourites !== -1) {
    return;
  }

  //Clonamos el nodo para añadirlo en favoritos
  const clonedLiHtml = liHtml.cloneNode(true);
  /*
  clonedLiHtml.classList = '';
  clonedLiHtml.classList.add('la-clase-para-favoritos');
  */
  favoritesList.appendChild(clonedLiHtml);

  //Añadir el listener de remover favorito
  clonedLiHtml.addEventListener('click', () => removeFavourite(clonedLiHtml));
};

const addEventListenerToResults = () => {
  const resultsList = containerResults.querySelector('.js-resultsList');
  resultsList.childNodes.forEach(result => {
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

    getApiData(searchTerm).then(results => {
      renderResults(listResults, results);
      containerResults.appendChild(listResults);
    }).then(() => {
      addEventListenerToResults();
    });

  } else { //si no...
    containerResults.innerHTML = '';
    containerResults.innerHTML = `<p> Debes introducir una búqueda válida </p>`; // debe introducir una búsqueda válida
  }
});

// Evento click en cada resultado mostrado
for (let resultEl of containerResults.childNodes){
  resultEl.addEventListener('click', addFavourite);
}
