import { createCard } from './createCard.js';

let data = {
  url: '../database/',
  async getSectionData(sectionTitle) {
    return await fetch(`${this.url}${sectionTitle}.json`).then(res => res.json());
  }
};

async function renderSection(sectionTitle) {
  const section = document.getElementById('lamps');
  const productsList = section.querySelector('.products-list');
  productsList.innerHTML = '';
  const productsArr = await data.getSectionData(sectionTitle);

  productsArr.forEach(productData => {
    createCard(productData, productsList);
  })
};

function renderCatalog() {
  renderSection('lamps');
}

renderCatalog();
