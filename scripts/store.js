// eslint-disable-next-line no-unused-vars
const store = (function() {

  const toggleAddItemForm = function() {
    this.isAdding = !this.isAdding;
  };

  const addItemToStore = function(item) {
    this.items.unshift(item);
  };

  const setRatingFilter = function(rating) {
    if (rating === 'none') {
      this.ratingFilter = null;
    } else {
      this.ratingFilter = rating;
    }
  };

  const toggleDetail = function(id) {
    const item = this.items.find(item => item.id === id);
    item.isExpanded = !item.isExpanded;
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
    setRatingFilter,
    toggleDetail,
    findItemAndDelete
  };

}());