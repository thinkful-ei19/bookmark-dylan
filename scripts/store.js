// eslint-disable-next-line no-unused-vars
const store = (function() {

  function toggleAddItemForm() {
    this.isAdding = !this.isAdding;
  }

  const addItemToStore = function(item) {
    this.items.push(item);
  };

  const findItemAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };


  return {
    items: [],
    isAdding: false,
    ratingFilter: null,

    toggleAddItemForm,
    addItemToStore,
    findItemAndDelete
  };

}());