// eslint-disable-next-line no-unused-vars
const store = (function() {

  function toggleAddItemForm() {
    this.isAdding = !this.isAdding;
  }

  const addItemToStore = function(item) {
    this.items.push(item);
  };


  return {
    items: [],
    isAdding: false,
    ratingFilter: null,

    toggleAddItemForm,
    addItemToStore
  };

}());