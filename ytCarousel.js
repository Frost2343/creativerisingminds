/* ========= YouTube Carousel Script ========= */

const ytVideos = [
  "iYzctKiw2PM",
  "vJoAklQxagI",
  "QX2NsjQGrJY",
  "DybtxopA5mI",
  "zIKRGYjonB8",
  "-_FiHkegyIk",
];

const carousel = document.querySelector(".yt-carousel");
if (!carousel) return; // Stops script safely if carousel does not exist

const dotsContainer = document.querySelector(".carousel-dots");
let ytIndex = 0;
let visible = window.innerWidth <= 600 ? 1 : window.innerWidth <= 992 ? 2 : 3;

/* Render thumbnails */
function renderVideos() {
  carousel.innerHTML = ytVideos
    .map(
      id => `
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
    `
    )
    .join("");
}

/* Slide Carousel */
function updateCarousel() {
  const width = document.querySelector(".yt-item").offsetWidth + 20;
  carousel.style.transform = `translateX(-${ytIndex * width}px)`;
  updateDots();
}

/* Pagination Dots */
function createDots() {
  dotsContainer.innerHTML = "";
  for (let i = 0; i <= ytVideos.length - visible; i++) {
    const dot = document.createElement("div");
    dot.classList.add("carousel-dot");
    dot.onclick = () => {
      ytIndex = i;
      updateCarousel();
    };
    dotsContainer.appendChild(dot);
  }
}
function updateDots() {
  document.querySelectorAll(".carousel-dot").forEach((dot, i) =>
    dot.classList.toggle("active", i === ytIndex)
  );
}

/* Arrows */
document.querySelector(".next-btn").onclick = () => {
  if (ytIndex < ytVideos.length - visible) ytIndex++;
  updateCarousel();
};
document.querySelector(".prev-btn").onclick = () => {
  if (ytIndex > 0) ytIndex--;
  updateCarousel();
};

/* Swipe Mobile */
let startX = 0;
const container = document.querySelector(".yt-carousel-container");
container.addEventListener("touchstart", e => (startX = e.touches[0].clientX));
container.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (dx < -40 && ytIndex < ytVideos.length - visible) ytIndex++;
  if (dx > 40 && ytIndex > 0) ytIndex--;
  updateCarousel();
});

/* Init */
renderVideos();
createDots();
updateCarousel();

/* Resize */
window.addEventListener("resize", () => {
  visible = window.innerWidth <= 600 ? 1 : window.innerWidth <= 992 ? 2 : 3;
  createDots();
  updateCarousel();
});
