/* global store, $, api */

// eslint-disable-next-line no-unused-vars
const bookmark = (function() {

  const generateItemHtml = function(item) {
    return `<li class="bookmark-item">
              <div class="item__information">
                <p class="item__information--title">${item.title}</p>
                <p class="item__information--description">${item.desc}</p>
                <a href="${item.url}" class="item__information--link">Visit Site</a>
                <p class="item__information--rating">Rating: <span class="rating--number">${item.rating}</span></p>
              </div>
              <div class="item__buttons">
                <button class="item__buttons--toggle">Show details</button>
                <button class="item__buttons--delete">Delete</button>
              </div>
            </li>
    `;
  };

  const render = function() {
    store.isAdding ? $('#add-form').css( { display: 'flex', 'flex-direction': 'column' } ) : $('#add-form').css( { display: 'none' } );

    const html = store.items.map(generateItemHtml);
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
        store.addItemToStore(newItem);
        render();
      });

    });
  };

  function bindEventListeners() {
    handleNewItemSubmit();
    handleToggleForm();
  }

  return {
    render,
    bindEventListeners
  };

}());