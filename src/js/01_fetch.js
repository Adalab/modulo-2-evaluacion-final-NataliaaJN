'use strict';

//               COGER DATOS DEL API           //
const getApiData = (searchInputValue) => {
  return fetch(`${urlApi}${searchInputValue}`)
    .then((response) => response.json())
    .then((data) => data.data);
};