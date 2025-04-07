export function createCard(productData, productsList) {
  const productCard = document.createElement('li');
  productCard.classList.add('product-card');
  productsList.append(productCard);

  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');
  productCard.append(cardInner);

  const front = document.createElement('div');
  front.classList.add('card-rotate', 'card-rotate-front', `front-${productData.id}`);
  cardInner.append(front);

  const productBtnFront = document.createElement('button');
  productBtnFront.classList.add('product-button');
  front.append(productBtnFront);

  const productTitleLight = document.createElement('h4');
  productTitleLight.classList.add('product-title', 'product-title-light');
  productTitleLight.innerHTML = productData.name;
  productBtnFront.append(productTitleLight);

  const back = document.createElement('div');
  back.classList.add('card-rotate', 'card-rotate-back');
  cardInner.append(back);

  const sliderContainer = document.createElement('div');
  sliderContainer.classList.add('slider-container');
  back.append(sliderContainer);

  const slider = document.createElement('div');
  slider.classList.add('slider');
  sliderContainer.append(slider);

  let imgCounter = Number(productData.imgCounter);
  for (; imgCounter > 0; imgCounter--) {
    const img = document.createElement('img');
    img.classList.add('product-img');
    img.setAttribute('src', `img/products/${productData.id}/0${imgCounter}.jpg`); // Сделать добавление ноля
    img.setAttribute('alt', productData.attribute);
    slider.prepend(img);
  }

  const prevButton = document.createElement('button');
  prevButton.classList.add('slider-button', 'prev-button');
  prevButton.ariaLabel = 'Посмотреть предыдущий слайд';
  prevButton.innerHTML = '<svg class="slider-button-img" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z"/></svg>';

  const nextButton = document.createElement('button');
  nextButton.classList.add('slider-button', 'next-button');
  nextButton.ariaLabel = 'Посмотреть предыдущий слайд';
  nextButton.innerHTML = '<svg class="slider-button-img" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.29289 4.29289C8.68342 3.90237 9.31658 3.90237 9.70711 4.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L9.70711 19.7071C9.31658 20.0976 8.68342 20.0976 8.29289 19.7071C7.90237 19.3166 7.90237 18.6834 8.29289 18.2929L14.5858 12L8.29289 5.70711C7.90237 5.31658 7.90237 4.68342 8.29289 4.29289Z"/></svg>';

  sliderContainer.append(prevButton, nextButton);

  const productInfo = document.createElement('div');
  productInfo.classList.add('card-back-container');
  back.append(productInfo);

  function createCardText(text) {
    const productCardText = document.createElement('p');
    productCardText.classList.add('basic-text', 'product-card-text');
    productCardText.innerHTML = productData[text];
    productInfo.append(productCardText);
  }

  createCardText('title');
  if (productData.details1) createCardText('details1');
  if (productData.details2) createCardText('details2');
  if (productData.details3) createCardText('details3');

  const productBtnBack = document.createElement('button');
  productBtnBack.classList.add('product-button');
  productInfo.append(productBtnBack);

  const productTitleDark = document.createElement('h4');
  productTitleDark.classList.add('product-title', 'product-title-dark');
  productTitleDark.innerHTML = productData.name;
  productBtnBack.append(productTitleDark);

  flipOver(front, productBtnBack, cardInner);
  slide(slider, prevButton, nextButton);
};

function flipOver(front, productBtnBack, cardInner) {
  front.addEventListener('click', () => {
    cardInner.classList.toggle('is-flipped');
  });

  productBtnBack.addEventListener('click', () => {
    cardInner.classList.toggle('is-flipped');
  });
}

function slide(slider, prevButton, nextButton) {
  const slides = Array.from(slider.querySelectorAll('.product-img'));
  const slideCount = slides.length;
  let slideIndex = 0;

  prevButton.addEventListener('click', showPreviousSlide);
  nextButton.addEventListener('click', showNextSlide);

  function showPreviousSlide() {
    slideIndex = (slideIndex - 1 + slideCount) % slideCount;
    updateSlider();
  }

  function showNextSlide() {
    slideIndex = (slideIndex + 1) % slideCount;
    updateSlider();
  }

  function updateSlider() {
    slides.forEach((slide, index) => {
      if (index === slideIndex) {
        slide.style.display = 'block';
      } else {
        slide.style.display = 'none';
      }
    });
  }

  updateSlider();
};
