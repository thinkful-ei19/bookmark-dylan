/* global $, store, api, bookmark */

function renderPage() {
  bookmark.render();
  bookmark.bindEventListeners();

  api.getItems(items => {
    items.forEach(item => store.addItemToStore(item));
    bookmark.render();
  });

}

$(renderPage);
