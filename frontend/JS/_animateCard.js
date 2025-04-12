export function flipOver(productBtnFront, productBtnBack, cardInner) {
  productBtnFront.addEventListener('click', () => {
    cardInner.classList.toggle('is-flipped');
  });

  productBtnBack.addEventListener('click', () => {
    cardInner.classList.toggle('is-flipped');
  });
}

export function slide(slider, prevButton, nextButton) {
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
