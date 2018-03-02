/* global $ */

// eslint-disable-next-line no-unused-vars
const api = (function() {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/dylan/bookmarks';

  const getItems = callback => {
    $.getJSON(BASE_URL, callback);
  };

  const createItem = (data, success, error) => {
    const settings = {
      url: BASE_URL,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: success,
      error: error
    };

    $.ajax(settings);
  };

  const updateItem = (id, updatedData, callback) => {
    const settings = {
      url: `${BASE_URL}/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updatedData),
      success: callback
    };

    $.ajax(settings);
  };


  const deleteItem = (id, callback) => {
    const settings = {
      url: `${BASE_URL}/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      data: '',
      success: callback
    };

    $.ajax(settings);
  };

  return {
    getItems,
    createItem,
    updateItem,
    deleteItem
  };

}());