import {createCard} from './_createCard.js';
import {getProductsDataArray} from './_data.js';
import {addProduct} from './_changeProduct.js';

export async function renderCatalog() {
    const catalogData = await getProductsDataArray();
    const sectionsNames = ['lamps', 'tables', 'kitchens'];
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

const btnAdd = document.createElement('button');
btnAdd.classList.add('btn-more');
btnAdd.innerHTML = 'Добавить изделие';
document.body.appendChild(btnAdd);

btnAdd.addEventListener('click', () => {
    addProduct();
});
