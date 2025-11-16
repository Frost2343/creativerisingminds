const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const images = document.querySelectorAll('.carousel-image');
let currentIndex = 0;
let overlay = null;
let fullscreenLeft, fullscreenRight;

function updateCarousel() {
  if (!carousel) return; // if page doesn't have carousel
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
  nextBtn.style.display = currentIndex === images.length - 1 ? 'none' : 'block';
}

function updateFullscreenNav() {
  if (!fullscreenLeft || !fullscreenRight) return;
  fullscreenLeft.style.display = currentIndex === 0 ? 'none' : 'block';
  fullscreenRight.style.display = currentIndex === images.length - 1 ? 'none' : 'block';
}

// Only run carousel code if carousel exists
if (carousel && images.length > 0) {
  nextBtn.addEventListener('click', () => {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      overlay = document.createElement('div');
      overlay.className = 'fullscreen-overlay';

      const fullscreenImg = img.cloneNode();
      fullscreenImg.className = 'fullscreen-img';

      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = () => {
        overlay.remove();
        overlay = null;
      };

      fullscreenLeft = document.createElement('button');
      fullscreenLeft.className = 'fullscreen-nav-button fullscreen-left';
      fullscreenLeft.innerHTML = '&#x276E;';
      fullscreenLeft.onclick = () => {
        if (currentIndex > 0) {
          currentIndex--;
          fullscreenImg.src = images[currentIndex].src;
          updateFullscreenNav();
        }
      };

      fullscreenRight = document.createElement('button');
      fullscreenRight.className = 'fullscreen-nav-button fullscreen-right';
      fullscreenRight.innerHTML = '&#x276F;';
      fullscreenRight.onclick = () => {
        if (currentIndex < images.length - 1) {
          currentIndex++;
          fullscreenImg.src = images[currentIndex].src;
          updateFullscreenNav();
        }
      };

      overlay.appendChild(closeBtn);
      overlay.appendChild(fullscreenLeft);
      overlay.appendChild(fullscreenRight);
      overlay.appendChild(fullscreenImg);
      document.body.appendChild(overlay);

      updateFullscreenNav();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (overlay) {
      if (e.key === 'Escape') {
        overlay.remove();
        overlay = null;
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        currentIndex++;
        document.querySelector('.fullscreen-img').src = images[currentIndex].src;
        updateFullscreenNav();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        currentIndex--;
        document.querySelector('.fullscreen-img').src = images[currentIndex].src;
        updateFullscreenNav();
      }
      return;
    }

    if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
      currentIndex++;
      updateCarousel();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  updateCarousel();
}
