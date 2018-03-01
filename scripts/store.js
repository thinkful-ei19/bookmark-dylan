/* global $ */

// eslint-disable-next-line no-unused-vars
const store = (function() {

  function showAddItemForm() {
    $('.js-add-item-form').click(function(event) {
      $('#add-form').css( {display: 'flex', 'flex-direction': 'column'} );
    });
  }


  return {
    items: [],
    isAdding: false,
    ratingFilter: null,

    showAddItemForm
  };

}());