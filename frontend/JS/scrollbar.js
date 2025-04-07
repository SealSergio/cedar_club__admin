const scrollbar = document.querySelector('.scrollbar');
const thumb = document.querySelector('.scrollbar__thumb');

function updateThumb() {
    const top = window.pageYOffset;
    const windowHeight = document.body.scrollHeight;
    const scrollbarHeight = scrollbar.scrollHeight;
    const margin = (scrollbarHeight - 48) * (top / (windowHeight - scrollbarHeight));
    thumb.style.top = `${margin}px`;
}

let thumbIsActive = false;

window.addEventListener('scroll', () => {
  let timer = 0;
  thumb.style.opacity = '0.5';
  updateThumb();

  if (!thumbIsActive) {
    timer = 2000;
    setTimeout(() => {
      thumb.style.opacity = '0';
    }, timer);
  };
});

scrollbar.addEventListener('mouseover', () => {
  thumb.style.opacity = '0.5';
  updateThumb();
  thumbIsActive = true;
});

scrollbar.addEventListener('mouseout', () => {
  thumb.style.opacity = '0';
  thumbIsActive = false;
});

let isDragging = false;

thumb.addEventListener('mousedown', () => {
  isDragging = true;
  document.body.style.cursor = 'grabbing';
  document.body.style.userSelect = 'none';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.cursor = 'default';
  document.body.style.userSelect = 'auto';
});

scrollbar.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const scrollbarRect = scrollbar.getBoundingClientRect();
    const scrollableHeight = document.body.scrollHeight;
    let newY = e.clientY - scrollbarRect.top - 48;
    newY = Math.max(0, Math.min(newY, scrollbarRect.height - 48));
    thumb.style.top = `${newY}px)`;
    window.scrollTo({
      top: (newY / (scrollbarRect.height - 48)) * scrollableHeight,
    });
  }
});

