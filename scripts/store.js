// eslint-disable-next-line no-unused-vars
const store = (function() {

  function toggleAddItemForm() {
    this.isAdding = !this.isAdding;
  }


  return {
    items: [],
    isAdding: false,
    ratingFilter: null,

    toggleAddItemForm
  };

}());