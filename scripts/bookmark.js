/* global store, $, api */

// eslint-disable-next-line no-unused-vars
const bookmark = (function() {

  const getIdFromElement = function(item) {
    return $(item).parents('li').data('item-id');
  };

  const generateItemHtml = function(item) {

    let detailClass = 'hidden';
    let detailButtonText = 'Show';

    if (item.isExpanded) {
      detailClass = '';
      detailButtonText = 'Hide';
    }


    return `<li class="bookmark-item" data-item-id=${item.id}>
              <div class="item__information">
                <p class="item__information--title">${item.title}</p>
                <div class="js-details ${ detailClass }">
                  <p class="item__information--description">${item.desc}</p>
                  <a target="_blank" href="${item.url}" class="item__information--link">Visit Site</a>
                </div>
                <p class="item__information--rating">Rating: <span class="rating--number">${item.rating}/5</span></p>
              </div>
              <div class="item__buttons">
                <button class="item__buttons--toggle js-item-toggle">${detailButtonText} details</button>
                <button class="item__buttons--delete js-item-delete">Delete</button>
              </div>
            </li>
    `;
  };

  const render = function() {
    store.isAdding ? $('#add-form').css( { display: 'flex' } ) : $('#add-form').css( { display: 'none' } );

    let filteredItems = store.items;

    if (store.ratingFilter) {
      filteredItems = filteredItems.filter(item => item.rating >= store.ratingFilter);
    }

    const html = filteredItems.map(generateItemHtml);
    $('.bookmark-list').html(html);

    console.log('render ran');
  };

  const handleToggleForm = function() {
    $('.js-add-item-form').click(() => {
      store.toggleAddItemForm();
      render();
    });
  };

  const handleNewItemSubmit = function() {
    $('.js-add-form').submit(function(event) {
      event.preventDefault();
      const title = $(event.currentTarget).find('#title').val();
      const url = $(event.currentTarget).find('#link').val();
      const desc = $(event.currentTarget).find('#description').val();
      const rating = $('input[name=rating]:checked').val();
      const data = { title, url, desc, rating };

      api.createItem(data, (newItem) => {
        store.isAdding = false;
        store.addItemToStore(newItem);
        render();
      });

      $(event.currentTarget).find('#title').val('');
      $(event.currentTarget).find('#link').val('');
      $(event.currentTarget).find('#description').val('');
      $(event.currentTarget).find('input[name=rating]:checked').prop('checked', false);

    });
  };

  const handleFilterByRating = function() {
    $('#rating').change(function(event) {
      const rating = $(event.currentTarget).val();
      console.log(rating);
      store.setRatingFilter(rating);
      render();
    });
  };

  const handleToggleDetailView = function() {
    $('.bookmark-list').on('click', '.js-item-toggle', function(event) {
      const id = getIdFromElement(event.currentTarget);
      store.toggleDetail(id);
      render();
    });
  };

  const handleDeleteItem = function() {
    $('.bookmark-list').on('click', '.js-item-delete', function(event) {
      const id = getIdFromElement(event.currentTarget);
      api.deleteItem(id, function() {
        store.findItemAndDelete(id);
        render();
      });
    });
  };

  function bindEventListeners() {
    handleNewItemSubmit();
    handleFilterByRating();
    handleToggleForm();
    handleDeleteItem();
    handleToggleDetailView();
  }

  return {
    render,
    bindEventListeners
  };

}());