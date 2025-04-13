import {createModalWindow, closeModalWindow, createForm} from './_modalWindow.js';
import {renderCatalog} from './main.js';
import * as data from './_data.js';
import * as hashFunctions from './_hash.js';

export function addProduct() {
    const modal = createModalWindow();
    modal.modalWindow.classList.add('modal-window_big');
    modal.modalWindowTitle.innerHTML = 'Новый клиент';
    modal.btnSubmit.innerHTML = 'Сохранить';
    modal.btnCancel.innerHTML = ' Отмена';

    const form = createForm(modal, null);

    modal.btnSubmit.addEventListener('click', async e => {
        e.preventDefault();
        const updatedProductObj = {
            id: form.inputsArr[0].value,
            name: form.inputsArr[1].value,
            title: form.inputsArr[2].value,
            details1: form.inputsArr[3].value,
            details2: form.inputsArr[4].value,
            details3: form.inputsArr[5].value,
            imgCounter: form.inputsArr[6].value,
            attribute: form.inputsArr[7].value,
        };

        const changeProductData = await data.addProductData(updatedProductObj);
        if (changeProductData.ok) {
            const productsDataArray = await data.getProductsDataArray();
            closeModalWindow(modal.modalWindowWrapper);
            renderCatalog(productsDataArray);
        }
    });

    modal.btnCancel.addEventListener('click', () => {
        closeModalWindow(modal.modalWindowWrapper);
    });
}

export async function editProduct(id) {
    const modal = createModalWindow();
    modal.modalWindow.classList.add('modal-window_big');
    hashFunctions.changeHash(id)
    modal.modalWindowTitle.innerHTML = 'Изменить\u00A0данные';
    modal.btnSubmit.innerHTML = 'Сохранить';
    modal.btnCancel.innerHTML = 'Удалить\u00A0изделие';
    const productObj = (await data.getProductData(id)).productData;

    const form = createForm(modal, productObj);

    form.inputsArr[0].value = productObj.id;
    form.inputsArr[1].value = productObj.name;
    form.inputsArr[2].value = productObj.title;
    form.inputsArr[3].value = productObj.details1;
    form.inputsArr[4].value = productObj.details2;
    form.inputsArr[5].value = productObj.details3;
    form.inputsArr[6].value = productObj.imgCounter;
    form.inputsArr[7].value = productObj.attribute;

    modal.btnSubmit.addEventListener('click', async (e) => {
        e.preventDefault();
        const updatedProductObj = {
            id: form.inputsArr[0].value,
            name: form.inputsArr[1].value,
            title: form.inputsArr[2].value,
            details1: form.inputsArr[3].value,
            details2: form.inputsArr[4].value,
            details3: form.inputsArr[5].value,
            imgCounter: form.inputsArr[6].value,
            attribute: form.inputsArr[7].value,
        };

        const changeProductData = await data.changeProductData(updatedProductObj, id);
        if (changeProductData.ok) {
            const productsDataArray = await data.getProductsDataArray();
            closeModalWindow(modal.modalWindowWrapper);
            renderCatalog(productsDataArray);
        }
    });

    modal.btnCancel.addEventListener('click', async (e) => {
        if (confirm('Вы действительно хотите удалить данное изделие?')) {
            const deleteProductData = await data.deleteProductData(productObj.id);
            if (deleteProductData.ok) {
                const productsDataArray = await data.getProductsDataArray();
                renderCatalog(productsDataArray);
                closeModalWindow(modal.modalWindowWrapper);
            }
        }
    });
}

export function deleteProduct(id) {
    const modal = createModalWindow();
    modal.modalWindow.classList.add('modal-window_small');
    modal.modalWindowTitle.innerHTML = 'Удалить изделие';
    modal.modalWindowTitle.classList.add('modal-window__title--delete');
    const deleteQuestion = document.createElement('p');
    deleteQuestion.innerHTML = 'Удалить это изделие?';
    deleteQuestion.classList.add('basic-text', 'modal-window__text--delete');

    modal.btnSubmit.innerHTML = 'Удалить';
    modal.btnCancel.innerHTML = 'Отмена';

    modal.modalWindow.append(deleteQuestion, modal.btnSubmit, modal.btnCancel);

    modal.btnCancel.addEventListener('click', () => {
        closeModalWindow(modal.modalWindowWrapper);
    });

    modal.btnSubmit.addEventListener('click', async () => {
        const deleteProductData = await data.deleteProductData(id);
        if (deleteProductData.ok) {
            const productsDataArray = await data.getProductsDataArray();
            renderCatalog(productsDataArray);
            closeModalWindow(modal.modalWindowWrapper);
        }
    });
}
