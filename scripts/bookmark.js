/* global store, $, api */

// eslint-disable-next-line no-unused-vars
const bookmark = (function() {

  const getIdFromElement = function(item) {
    return $(item).parents('li').data('item-id');
  };

  const generateItemHtml = function(item) {

    let detailClass = 'hidden';
    let detailButtonText = 'Show';
    let editClass = 'hidden';
    let editFormClass = 'hidden';

    if (item.isExpanded) {
      detailClass = '';
      detailButtonText = 'Hide';
      editClass = '';
    }

    if (item.canEdit) {
      editFormClass = '';
    }

    return `<li data-item-id=${item.id}>
              <div class="bookmark-item">
                <div class="item__information">
                  <p class="item__information--title">${item.title}</p>
                  <div class="js-details ${ detailClass }">
                    <a target="_blank" href="${item.url}" class="item__information--link">Visit Site</a>
                    <p class="item__information--description">${item.desc}</p>
                  </div>
                  <p class="item__information--rating">Rating: <span class="rating--number">${item.rating}</span>/5</p>
                </div>
                <div class="item__buttons">
                  <button class="item__buttons--toggle js-item-toggle">${detailButtonText} details</button>
                  <button class="item__buttons--edit js-item-edit ${editClass}">Edit</button>
                  <button class="item__buttons--delete js-item-delete">Delete</button>
                </div>
              </div>
              <form class="edit-form js-edit-form ${editFormClass}">
                <label for="edit-description">Description</label>
                <textarea id="edit-description" name="textarea" rows="10" cols="50"></textarea>
                <div class="edit-rating-wrap">
                  <p>Rating: </p>

                  <input type="radio" id="1"
                    name="edit-rating" value="1">
                  <label for="1">1</label>
              
                  <input type="radio" id="2"
                    name="edit-rating" value="2">
                  <label for="2">2</label>
              
                  <input type="radio" id="3"
                    name="edit-rating" value="3">
                  <label for="3">3</label>

                  <input type="radio" id="4"
                    name="edit-rating" value="4">
                  <label for="4">4</label>

                  <input type="radio" id="5"
                    name="edit-rating" value="5">
                  <label for="5">5</label>
                </div>
                <button type="submit" class="edit-form-submit">Save Changes</button>
              </form>
            </li>
    `;
  };

  const render = function() {
    !store.isAdding ? $('#add-form').addClass('hidden') : $('#add-form').removeClass('hidden');

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

  const handleToggleEdit = function() {
    $('.bookmark-list').on('click', '.js-item-edit', function(event) {
      const id = getIdFromElement(event.currentTarget);
      store.toggleEditItem(id);
      render();
    });
  };

  const handleEditItem = function() {
    $('.bookmark-list').on('submit', '.js-edit-form', function(event) {
      event.preventDefault();
      const descFromInput = $(event.currentTarget).find('#edit-description').val();
      const ratingFromInput = $(event.currentTarget).find('input[name=edit-rating]:checked').val();

      const currentDesc = $(event.currentTarget).parents('li').find('.item__information--description').text();
      const currentRating = $(event.currentTarget).parents('li').find('.rating--number').text();
      
      const data = {
        desc: descFromInput,
        rating: ratingFromInput
      };

      if (!descFromInput) data.desc = currentDesc;

      if (!ratingFromInput) data.rating = currentRating;

      const id = getIdFromElement(event.currentTarget);

      api.updateItem(id, data, function() {
        store.updateItem(id, data);
        render();
      });

      $(event.currentTarget).find('#edit-description').val('');
      $(event.currentTarget).find('input[name=edit-rating]:checked').prop('checked', false);

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
    handleToggleEdit();
    handleEditItem();
    handleToggleDetailView();
  }

  return {
    render,
    bindEventListeners
  };

}());