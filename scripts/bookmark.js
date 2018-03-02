/* global store, $, api */

// eslint-disable-next-line no-unused-vars
const bookmark = (function() {

  const getIdFromElement = function(item) {
    return $(item).parents('li').data('item-id');
  };

  const generateErrorMessageHtml = function(message) {
    if (store.errorMessage) {
      return `
        <p>${message}</p>
        <button class="exit-error-message">X</button>
      `;
    } else {
      return '';
    }
  };

  const generateAddFormHtml = function() {

    if (!store.isAdding) {
      return '';
    } else {
      return `<form id="add-form" class="js-add-form" role="form">
                <div class="title-url-wrap">
                  <label for="title">Title: </label>
                  <input id="title" type="text" placeholder="title">
                  <label for="link">URL: </label>
                  <input id="link" type="text" placeholder="link">
                </div>
                <label for="description">Description: </label>
                <textarea id="description" name="textarea" rows="10" cols="50" placeholder="description"></textarea>
                <div class="rating-submit-wrap">
                  <div class="rating-wrap">
                    <p>Rating: </p>

                    <input type="radio" id="1" name="rating" value="1">
                    <label for="1">1</label>
                
                    <input type="radio" id="2" name="rating" value="2">
                    <label for="2">2</label>
                
                    <input type="radio" id="3" name="rating" value="3">
                    <label for="3">3</label>

                    <input type="radio" id="4" name="rating" value="4">
                    <label for="4">4</label>

                    <input type="radio" id="5" name="rating" value="5">
                    <label for="5">5</label>
                  </div>

                  <button class="submit-item js-submit-item" role="button">Submit</button>
                </div>
              </form>
            `;
    }
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

    if (item.canEdit && item.isExpanded) editFormClass = '';

    return `<section role="region">
              <li data-item-id=${item.id}>
                <div class="bookmark-item">
                  <div class="item__information">
                    <p class="item__information--title">${item.title}</p>
                    <div class="js-details ${ detailClass }">
                      <a target="_blank" rel="noopener noreferrer" href="${item.url}" class="item__information--link">Visit Site</a>
                      <p class="item__information--description">${item.desc}</p>
                    </div>
                    <p class="item__information--rating">Rating: <span class="rating--number">${item.rating}</span>/5</p>
                  </div>
                  <div class="item__buttons">
                    <button class="item__buttons--toggle js-item-toggle" role="button">${detailButtonText} details</button>
                    <button class="item__buttons--edit js-item-edit ${editClass}" role="button">Edit</button>
                    <button class="item__buttons--delete js-item-delete" role="button">Delete</button>
                  </div>
                </div>
                <form class="edit-form js-edit-form ${editFormClass}" role="form">
                  <label for="edit-description">Description: </label>
                  <textarea id="edit-description" name="textarea" rows="10" cols="50">${item.desc}</textarea>
                  <div class="edit-rating-wrap">
                    <p>Rating: </p>
                    <input type="radio" id="1" name="edit-rating-${item.id}" value="1">
                    <label for="1">1</label>
                
                    <input type="radio" id="2" name="edit-rating-${item.id}" value="2">
                    <label for="2">2</label>
                
                    <input type="radio" id="3" name="edit-rating-${item.id}" value="3">
                    <label for="3">3</label>

                    <input type="radio" id="4" name="edit-rating-${item.id}" value="4">
                    <label for="4">4</label>

                    <input type="radio" id="5" name="edit-rating-${item.id}" value="5">
                    <label for="5">5</label>
                  </div>
                  <button type="submit" class="edit-form-submit" role="button">Save Changes</button>
                </form>
              </li>
             </section> 
    `;
  };

  const render = function() {
    let filteredItems = store.items;

    if (store.ratingFilter) filteredItems = filteredItems.filter(item => item.rating >= store.ratingFilter);

    const errorMessageHtml = generateErrorMessageHtml(store.errorMessage);
    $('.error-message-wrap').html(errorMessageHtml);

    const addFormHtml = generateAddFormHtml();
    $('.add-form-wrap').html(addFormHtml);

    const html = filteredItems.map(generateItemHtml);
    $('.bookmark-list').html(html);

    console.log('render ran');
  };

  const handleToggleForm = () => {
    $('.js-add-item-form').click(() => {      
      store.toggleAddItemForm();
      store.errorMessage = '';
      render();
    });
  };

  const handleNewItemSubmit = () => {
    $('.add-form-wrap').on('submit', '.js-add-form', event => {
      event.preventDefault();
      const title = $(event.currentTarget).find('#title').val();
      const url = $(event.currentTarget).find('#link').val();
      const desc = $(event.currentTarget).find('#description').val();
      const rating = $('input[name=rating]:checked').val();
      const data = { title, url, desc, rating };

      const successCallback = (newItem) => {
        store.toggleAddItemForm();
        store.addItemToStore(newItem);
        render();
      };

      const errorCallback = response => {
        // console.log(response.responseJSON.message);
        const message = response.responseJSON.message;

        store.errorMessage = message;
        render();
      };

      api.createItem(data, successCallback, errorCallback);

      $(event.currentTarget).find('#title').val('');
      $(event.currentTarget).find('#link').val('');
      $(event.currentTarget).find('#description').val('');
      $(event.currentTarget).find('input[name=rating]:checked').prop('checked', false);

    });
  };

  const handleFilterByRating = () => {
    $('#rating').change(event => {
      const rating = $(event.currentTarget).val();
      store.setRatingFilter(rating);
      render();
    });
  };

  const handleToggleDetailView = () => {
    $('.bookmark-list').on('click', '.js-item-toggle', event => {
      const id = getIdFromElement(event.currentTarget);
      store.toggleDetail(id);
      render();
    });
  };

  const handleToggleEdit = () => {
    $('.bookmark-list').on('click', '.js-item-edit', event => {
      const id = getIdFromElement(event.currentTarget);
      store.toggleEditItem(id);
      render();
    });
  };

  const handleEditItem = () => {
    $('.bookmark-list').on('submit', '.js-edit-form', event => {
      event.preventDefault();
      const id = getIdFromElement(event.currentTarget);
      const descFromInput = $(event.currentTarget).find('#edit-description').val();
      const ratingFromInput = $(event.currentTarget).find(`input[name=edit-rating-${id}]:checked`).val();

      const currentDesc = $(event.currentTarget).parents('li').find('.item__information--description').text();
      const currentRating = $(event.currentTarget).parents('li').find('.rating--number').text();
      
      const data = {
        desc: descFromInput,
        rating: ratingFromInput
      };

      if (!descFromInput) data.desc = currentDesc;

      if (!ratingFromInput) data.rating = currentRating;

      api.updateItem(id, data, () => {
        store.updateItem(id, data);
        render();
      });

      $(event.currentTarget).find('#edit-description').val('');
      $(event.currentTarget).find('input[name=edit-rating]:checked').prop('checked', false);

    });
  };

  const handleDeleteItem = () => {
    $('.bookmark-list').on('click', '.js-item-delete', event => {
      const id = getIdFromElement(event.currentTarget);
      api.deleteItem(id, () => {
        store.findItemAndDelete(id);
        render();
      });
    });
  };

  const handleDeleteErrorMessage = () => {
    $('.error-message-wrap').on('click', '.exit-error-message', event => {
      event.preventDefault();
      store.errorMessage = '';
      render();
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
    handleDeleteErrorMessage();
  }

  return {
    render,
    bindEventListeners
  };

}());