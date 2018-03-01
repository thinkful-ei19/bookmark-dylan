/* global $, store, api */

function renderPage() {
  store.showAddItemForm();
}

$(renderPage);

const testData = { title: 'cats', rating: 5, description: 'ilovecats', url: 'http://cats.com' };

// api.getItems(
//   api.createItem(testData, response => {
//     console.log(response);
//   }));

api.getItems(response => {
  console.log(response);
});
