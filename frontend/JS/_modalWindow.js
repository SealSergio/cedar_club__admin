import * as data from './_data.js';
import * as hashFunctions from './_hash.js';

export function createModalWindow() {
    const body = document.querySelector('body');
    body.classList.toggle('noscroll');

    const modalWindowWrapper = document.createElement('div');
    modalWindowWrapper.classList.add('modal-window-wrapper');

    const modalWindow = document.createElement('div');
    modalWindow.classList.add('modal-window');

    const modalWindowTitle = document.createElement('h2');
    modalWindowTitle.classList.add('modal-window__title');

    const clearBtn = document.createElement('button');
    clearBtn.classList.add('modal-window__clear-btn');
    clearBtn.ariaLabel = 'Закрыть окно';
    const leftBar = document.createElement('span');
    leftBar.classList.add('modal-window__clear-btn__bar_left', 'modal-window__clear-btn__bar')
    const rightBar = document.createElement('span');
    rightBar.classList.add('modal-window__clear-btn__bar_right', 'modal-window__clear-btn__bar');
    clearBtn.append(leftBar, rightBar);
    clearBtn.addEventListener('click', () => {
        closeModalWindow(modalWindowWrapper);
    });

    const btnSubmit = document.createElement('button');
    btnSubmit.type = 'submit';
    btnSubmit.classList.add('modal-window__btn', 'modal-window__btn_submit');

    const btnCancel = document.createElement('button');
    btnCancel.type = 'button';
    btnCancel.classList.add('modal-window__btn', 'modal-window__btn_cancel');

    body.append(modalWindowWrapper);
    modalWindowWrapper.append(modalWindow);
    modalWindow.append(modalWindowTitle, clearBtn);

    return {body, modalWindowWrapper, modalWindow, modalWindowTitle, btnSubmit, btnCancel};
}

export function closeModalWindow(modalWindowWrapper) {
    document.body.classList.toggle('noscroll');
    modalWindowWrapper.remove();
    hashFunctions.resetHash();
}

export function createForm(modal, productObj) {
    const form = document.createElement('form');
    form.classList.add('form');

    const inputsArr = {
        inputId: null,
        inputName: null,
        inputTitle: null,
        inputDetails1: null,
        inputDetails2: null,
        inputDetails3: null,
        inputImgCounter: null,
        inputAttribute: null
    };
    const namesArr = [
        'ID',
        'Имя',
        'Название',
        'Описание 1',
        'Описание 2',
        'Описание 3',
        'Количество фото',
        'Атрибут'
    ];

    let inputsValues;

    if (productObj) {
        inputsValues = [productObj.id, productObj.name, productObj.title, productObj.details1, productObj.details2, productObj.details3, productObj.imgCounter, productObj.attribute];
    };

    for (let i = 0; i <= 7; i++) {
        const lable = document.createElement('label');
        lable.classList.add('form__label');
        const input = inputsArr[i] = document.createElement('input');
        input.classList.add('form__input');
        if (inputsValues) input.value = inputsValues[i];
        input.placeholder = namesArr[i];
        const span = document.createElement('span');
        span.classList.add('basic-text', 'form__label__span');
        span.innerHTML = namesArr[i];
        lable.append(span, input);
        form.append(lable);
    };

    inputsArr[6].type = 'number';

    modal.modalWindow.append(form);
    form.append(modal.btnSubmit, modal.btnCancel);

    return {inputsArr};
}
