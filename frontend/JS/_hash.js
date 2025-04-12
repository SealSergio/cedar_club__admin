export function resetHash() {
    location.hash = '';
}

// export function createProductHash(id) {
//     const emptyLink = document.createElement('a');
//     emptyLink.href = '';
//     return `${emptyLink.origin}/#/${id}`;
// }

export async function changeHash(id) {
    location.hash = `${id}`;
}

export async function checkHash() {
    if (location.hash !== '') {
        const copiedId = location.hash.replaceAll('#', '').replaceAll('/', '');
        const copiedProduct = await data.getProductData(copiedId);
        if (copiedProduct.response.ok) changeProduct(copiedProduct.productData);
        else {
            const modal = createModalWindow();
            modal.modalWindowTitle.innerHTML = 'Страница не найдена';
            modal.modalWindowTitle.classList.add('modal-window__title--delete');
            const notFound = document.createElement('p');
            notFound.innerHTML = 'Вы искали, а мы не нашли... &#128549;';
            notFound.classList.add('basic-text', 'modal-window__text--delete');
            modal.btnSubmit.innerHTML = 'На главную';
            const link = document.createElement('a');
            link.href = 'https://dinorunner.com/';
            link.target = '_blank';
            link.innerHTML = 'Не хочу на главную';
            modal.btnCancel.append(link);
            modal.modalWindow.append(notFound, modal.btnSubmit, modal.btnCancel);

            modal.btnSubmit.addEventListener('click', () => {
                closeModalWindow(modal.modalWindowWrapper);
            });
        };
    };
}
