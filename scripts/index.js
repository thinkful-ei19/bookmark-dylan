/* global $, store, api, bookmark */

function renderPage() {
  // store.showAddItemForm();
  bookmark.render();
  bookmark.addForm;
}

// $(renderPage);
$(bookmark.addForm);

const testData = { title: 'cats', rating: 5, description: 'ilovecats', url: 'http://cats.com' };

// api.getItems(
//   api.createItem(testData, response => {
//     console.log(response);
//   }));

api.getItems(response => {
  console.log(response);
});
