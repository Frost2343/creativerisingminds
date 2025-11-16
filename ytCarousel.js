document.addEventListener("DOMContentLoaded", () => {

  const ytVideos = [
    "iYzctKiw2PM",
    "vJoAklQxagI",
    "QX2NsjQGrJY",
    "DybtxopA5mI",
    "zIKRGYjonB8",
    "-_FiHkegyIk",
  ];

  const carousel = document.querySelector(".yt-carousel");
  const dotsContainer = document.querySelector(".carousel-dots");
  const container = document.querySelector(".yt-carousel-container");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  // If carousel container doesn't exist on page → stop
  if (!carousel || !container) return;

  let ytIndex = 0;
  let visible = window.innerWidth <= 600 ? 1 : window.innerWidth <= 992 ? 2 : 3;

  function renderVideos() {
    carousel.innerHTML = ytVideos
      .map(id => `
        <div class="yt-item">
          <a href="https://www.youtube.com/watch?v=${id}" target="_blank" class="yt-thumb-link">
            <div class="yt-thumb-wrapper">
              <img src="https://img.youtube.com/vi/${id}/maxresdefault.jpg"
                   onerror="this.src='https://img.youtube.com/vi/${id}/hqdefault.jpg'"
                   class="yt-thumb">
              <div class="yt-play-btn">▶</div>
            </div>
          </a>
        </div>
      `)
      .join("");
  }

  function updateCarousel() {
    const width = document.querySelector(".yt-item").offsetWidth + 20;
    carousel.style.transform = `translateX(-${ytIndex * width}px)`;
    updateDots();
  }

  function createDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i <= ytVideos.length - visible; i++) {
      const dot = document.createElement("div");
      dot.classList.add("carousel-dot");
      dot.onclick = () => { ytIndex = i; updateCarousel(); };
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === ytIndex);
    });
  }

  nextBtn.onclick = () => {
    if (ytIndex < ytVideos.length - visible) ytIndex++;
    updateCarousel();
  };

  prevBtn.onclick = () => {
    if (ytIndex > 0) ytIndex--;
    updateCarousel();
  };

  // Swipe controls for mobile
  let startX = 0;
  container.addEventListener("touchstart", e => (startX = e.touches[0].clientX));
  container.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -40 && ytIndex < ytVideos.length - visible) ytIndex++;
    if (dx > 40 && ytIndex > 0) ytIndex--;
    updateCarousel();
  });

  renderVideos();
  createDots();
  updateCarousel();

  window.addEventListener("resize", () => {
    visible = window.innerWidth <= 600 ? 1 : window.innerWidth <= 992 ? 2 : 3;
    createDots();
    updateCarousel();
  });
});
