import {createCard} from './_createCard.js';
import {getProductsDataArray} from './_data.js';
import {addProduct} from './_changeProduct.js';

export async function renderCatalog() {
    const catalogData = await getProductsDataArray();
    const sectionsNames = ['lamps', 'tables', 'arm-chairs', 'beds', 'chests', 'another', 'carving', 'kitchens', 'doors', 'decoration'];
    sectionsNames.forEach(sectionName => {
        const section = document.getElementById(sectionName);
        if (!section) return;
        let sectionProductsList = section.querySelector('.products-list');
        if (sectionProductsList) {
            sectionProductsList.innerHTML = '';
        } else {
            sectionProductsList = document.createElement('ul');
            sectionProductsList.classList.add('products-list');
            section.append(sectionProductsList);
        };
        const sectionData = catalogData.filter(product => product.id.includes(sectionName));
        sectionData.forEach(productData => {
            createCard(productData, sectionProductsList);
        });
    })
};

renderCatalog();

const btnAdd = document.querySelector('.btn-add');

btnAdd.addEventListener('click', () => {
    addProduct();
});
