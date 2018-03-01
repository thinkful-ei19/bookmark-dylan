/* global store, $ */

// eslint-disable-next-line no-unused-vars
const bookmark = (function() {

  const render = function() {
    store.isAdding ? $('#add-form').css( { display: 'flex', 'flex-direction': 'column' } ) : $('#add-form').css( { display: 'none' } );

    console.log('render ran');
  };

  const addForm = function() {
    $('.js-add-item-form').click(() => {
      console.log('click add button');
      store.toggleAddItemForm();
      render();
    });
  };

  return {
    render,
    addForm
  };

}());