// ==========================
// MOBILE NAVBAR TOGGLE
// ==========================
const menuToggle = document.querySelector('.menu-toggle');
const navbarUl = document.querySelector('.navbar ul');

menuToggle.addEventListener('click', () => {
  navbarUl.classList.toggle('show');
  menuToggle.classList.toggle('active'); // optional: for X animation
});
// ==========================
// HERO VIDEO - STOP AT END
// ==========================
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  heroVideo.addEventListener('ended', function () {
    this.currentTime = this.duration;
    this.pause();
  });
}

// ==========================
// SECTION SNAP SCROLL
// ==========================
(() => {
  let sections = [];
  let isScrolling = false;
  let scrollTarget = null;
  const SCROLL_FALLBACK_MS = 1200;
  const TOUCH_THRESHOLD = 50;
  const WHEEL_MIN = 10;

  function updateSections() {
    sections = Array.from(document.querySelectorAll("section"));
  }

  function getCurrentIndex() {
    const center = window.scrollY + window.innerHeight / 2;
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const top = s.offsetTop;
      const bottom = top + s.offsetHeight;
      if (center >= top && center < bottom) return i;
    }
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < sections.length; i++) {
      const mid = sections[i].offsetTop + sections[i].offsetHeight / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  function finishScrolling() {
    isScrolling = false;
    scrollTarget = null;
  }

  function snapToIndex(index) {
    if (isScrolling) return;
    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;
    const target = sections[index].offsetTop;
    const current = Math.round(window.scrollY);

    if (Math.abs(current - target) <= 2) {
      finishScrolling();
      return;
    }

    isScrolling = true;
    scrollTarget = target;

    window.scrollTo({ top: target, behavior: "smooth" });

    setTimeout(() => finishScrolling(), SCROLL_FALLBACK_MS);
  }

  window.addEventListener("scroll", () => {
    if (!isScrolling || scrollTarget === null) return;
    if (Math.abs(window.scrollY - scrollTarget) <= 2) finishScrolling();
  }, { passive: true });

  window.addEventListener("wheel", (e) => {
    if (isScrolling) { e.preventDefault(); return; }
    if (Math.abs(e.deltaY) < WHEEL_MIN) return;
    e.preventDefault();
    const cur = getCurrentIndex();
    if (e.deltaY > 0) snapToIndex(cur + 1);
    else snapToIndex(cur - 1);
  }, { passive: false, capture: true });

  let touchStartY = null;
  let touchMoved = false;

  window.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      touchMoved = false;
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (touchStartY === null) return;
    touchMoved = true;
  }, { passive: true });

  window.addEventListener("touchend", (e) => {
    if (touchStartY === null || !touchMoved) { touchStartY = null; touchMoved = false; return; }
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    touchStartY = null;
    touchMoved = false;
    if (Math.abs(diff) < TOUCH_THRESHOLD) return;
    const cur = getCurrentIndex();
    if (diff > 0) snapToIndex(cur + 1);
    else snapToIndex(cur - 1);
  }, { passive: true });

  window.addEventListener("keydown", (e) => {
    if (isScrolling) { e.preventDefault(); return; }
    const cur = getCurrentIndex();
    if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); snapToIndex(cur + 1); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); snapToIndex(cur - 1); }
    else if (e.key === "Home") { e.preventDefault(); snapToIndex(0); }
    else if (e.key === "End") { e.preventDefault(); snapToIndex(sections.length - 1); }
  }, { passive: false });

  window.addEventListener("resize", updateSections);
  const mo = new MutationObserver(updateSections);
  mo.observe(document.body, { childList: true, subtree: true });
  updateSections();
  window.addEventListener("load", () => {
    const idx = getCurrentIndex();
    window.scrollTo(0, sections[idx].offsetTop);
  });
})();



// ==========================
// NEW SLIDER SECTION (_id1)
// ==========================
const mainProgressBar = document.querySelector(
  ".progress-bar--primary_id1 .progress-bar__fill_id1"
);
const mainPosts = document.querySelectorAll(".main-post_id1");
const posts = document.querySelectorAll(".post_id1");

let i = 0;
let postIndex = 0;
let currentPost = posts[postIndex];
let currentMainPost = mainPosts[postIndex];

let progressInterval = setInterval(progress, 100);

function progress() {
  if (i === 100) {
    i = -5;
    // reset progress bar
    currentPost.querySelector(".progress-bar__fill_id1").style.width = 0;
    mainProgressBar.style.width = 0;
    currentPost.classList.remove("post--active_id1");

    postIndex++;

    currentMainPost.classList.add("main-post--not-active_id1");
    currentMainPost.classList.remove("main-post--active_id1");

    // reset postIndex to loop over the slides again
    if (postIndex === posts.length) {
      postIndex = 0;
    }

    currentPost = posts[postIndex];
    currentMainPost = mainPosts[postIndex];
  } else {
    i++;
    currentPost.querySelector(".progress-bar__fill_id1").style.width = `${i}%`;
    mainProgressBar.style.width = `${i}%`;
    currentPost.classList.add("post--active_id1");

    currentMainPost.classList.add("main-post--active_id1");
    currentMainPost.classList.remove("main-post--not-active_id1");
  }
}

posts.forEach((post, index) => {
  post.addEventListener("click", () => {
    disablePostsTemporarily();
    i = 0; // Reset the progress bar
    postIndex = index;
    updatePosts();
  });
});

function disablePostsTemporarily() {
  // Disable pointer events on all posts
  posts.forEach((post) => {
    post.classList.add("post--disabled_id1");
  });

  // Re-enable pointer events after 2 1/2 seconds
  setTimeout(() => {
    posts.forEach((post) => {
      post.classList.remove("post--disabled_id1");
    });
  }, 2500);
}

function updatePosts() {
  // Reset all progress bars and classes
  posts.forEach((post) => {
    post.querySelector(".progress-bar__fill_id1").style.width = 0;
    post.classList.remove("post--active_id1");
  });

  mainPosts.forEach((mainPost) => {
    mainPost.classList.add("main-post--not-active_id1");
    mainPost.classList.remove("main-post--active_id1");
  });

  // Update the current post and main post
  currentPost = posts[postIndex];
  currentMainPost = mainPosts[postIndex];

  currentPost.querySelector(".progress-bar__fill_id1").style.width = `${i}%`;
  mainProgressBar.style.width = `${i}%`;
  currentPost.classList.add("post--active_id1");

  currentMainPost.classList.add("main-post--active_id1");
  currentMainPost.classList.remove("main-post--not-active_id1");
}











const track_id5 = document.querySelector(".carousel-track_id5");
const cards_id5 = Array.from(track_id5.children);
const nextButton_id5 = document.querySelector(".carousel-button_id5.next_id5");
const prevButton_id5 = document.querySelector(".carousel-button_id5.prev_id5");
const container_id5 = document.querySelector(".carousel-container_id5");
const indicators_id5 = document.querySelectorAll(".indicator_id5");

let currentIndex_id5 = 0;
let cardWidth_id5 = cards_id5[0].offsetWidth;
let cardMargin_id5 = parseInt(window.getComputedStyle(cards_id5[0]).marginRight) * 2;


function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Initialize carousel
function initializeCarousel_id5() {
  cardWidth_id5 = cards_id5[0].offsetWidth;
  cardMargin_id5 = parseInt(window.getComputedStyle(cards_id5[0]).marginRight) * 2;

  const initialOffset = container_id5.offsetWidth / 2 - cardWidth_id5 / 2;
  track_id5.style.transform = `translateX(${initialOffset}px)`;
  updateCarousel_id5();
}

// Update cards & indicators
function updateCarousel_id5() {
  cards_id5.forEach((card, index) => {
    card.classList.remove(
      "is-active_id5", "is-prev_id5", "is-next_id5", "is-far-prev_id5", "is-far-next_id5"
    );
    if (index === currentIndex_id5) card.classList.add("is-active_id5");
    else if (index === currentIndex_id5 - 1) card.classList.add("is-prev_id5");
    else if (index === currentIndex_id5 + 1) card.classList.add("is-next_id5");
    else if (index < currentIndex_id5 - 1) card.classList.add("is-far-prev_id5");
    else if (index > currentIndex_id5 + 1) card.classList.add("is-far-next_id5");
  });

  indicators_id5.forEach((indicator, index) => {
    indicator.classList.toggle("active_id5", index === currentIndex_id5);
  });
}

// Move to slide
function moveToSlide_id5(targetIndex) {
  if (targetIndex < 0 || targetIndex >= cards_id5.length) return;

  const amountToMove = targetIndex * (cardWidth_id5 + cardMargin_id5);
  const containerCenter = container_id5.offsetWidth / 2;
  const cardCenter = cardWidth_id5 / 2;
  const targetTranslateX = containerCenter - cardCenter - amountToMove;

  track_id5.style.transform = `translateX(${targetTranslateX}px)`;
  currentIndex_id5 = targetIndex;
  updateCarousel_id5();
  handleCardActivation_id5();
}

// Buttons
nextButton_id5.addEventListener("click", () => moveToSlide_id5(currentIndex_id5 + 1));
prevButton_id5.addEventListener("click", () => moveToSlide_id5(currentIndex_id5 - 1));

// Indicators
indicators_id5.forEach((indicator, index) => {
  indicator.addEventListener("click", () => moveToSlide_id5(index));
});

// Swipe
let isDragging_id5 = false, startPos_id5 = 0, currentTranslate_id5 = 0, prevTranslate_id5 = 0, animationID_id5;
track_id5.addEventListener("mousedown", dragStart_id5);
track_id5.addEventListener("touchstart", dragStart_id5, { passive: true });
track_id5.addEventListener("mousemove", drag_id5);
track_id5.addEventListener("touchmove", drag_id5, { passive: true });
track_id5.addEventListener("mouseup", dragEnd_id5);
track_id5.addEventListener("mouseleave", dragEnd_id5);
track_id5.addEventListener("touchend", dragEnd_id5);

function dragStart_id5(event) {
  isDragging_id5 = true;
  startPos_id5 = getPositionX_id5(event);
  const matrix = window.getComputedStyle(track_id5).transform;
  currentTranslate_id5 = matrix !== "none" ? parseInt(matrix.split(",")[4]) : 0;
  prevTranslate_id5 = currentTranslate_id5;
  track_id5.style.transition = "none";
  animationID_id5 = requestAnimationFrame(animation_id5);
  track_id5.style.cursor = "grabbing";
}

function drag_id5(event) {
  if (isDragging_id5) {
    const currentPosition = getPositionX_id5(event);
    const moveX = currentPosition - startPos_id5;
    currentTranslate_id5 = prevTranslate_id5 + moveX;
  }
}

function animation_id5() {
  if (!isDragging_id5) return;
  track_id5.style.transform = `translateX(${currentTranslate_id5}px)`;
  requestAnimationFrame(animation_id5);
}

function dragEnd_id5() {
  if (!isDragging_id5) return;
  cancelAnimationFrame(animationID_id5);
  isDragging_id5 = false;
  track_id5.style.transition = "transform 0.75s cubic-bezier(0.21, 0.61, 0.35, 1)";
  track_id5.style.cursor = "grab";
  const movedBy = currentTranslate_id5 - prevTranslate_id5;
  const threshold = cardWidth_id5 / 3.5;
  if (movedBy < -threshold && currentIndex_id5 < cards_id5.length - 1) moveToSlide_id5(currentIndex_id5 + 1);
  else if (movedBy > threshold && currentIndex_id5 > 0) moveToSlide_id5(currentIndex_id5 - 1);
  else moveToSlide_id5(currentIndex_id5);
}

function getPositionX_id5(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") moveToSlide_id5(currentIndex_id5 + 1);
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") moveToSlide_id5(currentIndex_id5 - 1);
});

// Resize
window.addEventListener("resize", debounce(() => {
  initializeCarousel_id5();
  moveToSlide_id5(currentIndex_id5);
}, 250));

// Floating effect
function addFloatingEffect_id5() {
  cards_id5.forEach((card, index) => {
    const delay = index * 0.2;
    card.style.animation = `floating_id5 4s ease-in-out ${delay}s infinite`;
  });

  const style = document.createElement("style");
  style.textContent = `
    @keyframes floating_id5 {
      0% { transform: translateY(0px) rotate3d(0,1,0,0deg); }
      50% { transform: translateY(-10px) rotate3d(0,1,0,1deg); }
      100% { transform: translateY(0px) rotate3d(0,1,0,0deg); }
    }
  `;
  document.head.appendChild(style);
}

// Initialize
window.onload = () => {
  initializeCarousel_id5();
  moveToSlide_id5(2);
  addFloatingEffect_id5();
};



//Section: 6
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
const track_id6 = document.querySelector(".carousel-track_id6");
const cards_id6 = Array.from(track_id6.children);
const nextButton_id6 = document.querySelector(".carousel-button_id6.next_id6");
const prevButton_id6 = document.querySelector(".carousel-button_id6.prev_id6");
const container_id6 = document.querySelector(".carousel-container_id6");
const indicators_id6 = document.querySelectorAll(".indicator_id6");

let currentIndex_id6 = 0;
let cardWidth_id6 = cards_id6[0].offsetWidth;
let cardMargin_id6 = parseInt(window.getComputedStyle(cards_id6[0]).marginRight) * 2;

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Initialize carousel
function initializeCarousel_id6() {
  cardWidth_id6 = cards_id6[0].offsetWidth;
  cardMargin_id6 = parseInt(window.getComputedStyle(cards_id6[0]).marginRight) * 2;

  const initialOffset = container_id6.offsetWidth / 2 - cardWidth_id6 / 2;
  track_id6.style.transform = `translateX(${initialOffset}px)`;
  updateCarousel_id6();
}

// Update cards & indicators
function updateCarousel_id6() {
  cards_id6.forEach((card, index) => {
    card.classList.remove(
      "is-active_id6", "is-prev_id6", "is-next_id6", "is-far-prev_id6", "is-far-next_id6"
    );
    if (index === currentIndex_id6) card.classList.add("is-active_id6");
    else if (index === currentIndex_id6 - 1) card.classList.add("is-prev_id6");
    else if (index === currentIndex_id6 + 1) card.classList.add("is-next_id6");
    else if (index < currentIndex_id6 - 1) card.classList.add("is-far-prev_id6");
    else if (index > currentIndex_id6 + 1) card.classList.add("is-far-next_id6");
  });

  indicators_id6.forEach((indicator, index) => {
    indicator.classList.toggle("active_id6", index === currentIndex_id6);
  });
}

// Move to slide
function moveToSlide_id6(targetIndex) {
  if (targetIndex < 0 || targetIndex >= cards_id6.length) return;

  const amountToMove = targetIndex * (cardWidth_id6 + cardMargin_id6);
  const containerCenter = container_id6.offsetWidth / 2;
  const cardCenter = cardWidth_id6 / 2;
  const targetTranslateX = containerCenter - cardCenter - amountToMove;

  track_id6.style.transform = `translateX(${targetTranslateX}px)`;
  currentIndex_id6 = targetIndex;
  updateCarousel_id6();
  handleCardActivation_id6();
}

// Buttons
nextButton_id6.addEventListener("click", () => moveToSlide_id6(currentIndex_id6 + 1));
prevButton_id6.addEventListener("click", () => moveToSlide_id6(currentIndex_id6 - 1));

// Indicators
indicators_id6.forEach((indicator, index) => {
  indicator.addEventListener("click", () => moveToSlide_id6(index));
});

// Swipe
let isDragging_id6 = false, startPos_id6 = 0, currentTranslate_id6 = 0, prevTranslate_id6 = 0, animationID_id6;
track_id6.addEventListener("mousedown", dragStart_id6);
track_id6.addEventListener("touchstart", dragStart_id6, { passive: true });
track_id6.addEventListener("mousemove", drag_id6);
track_id6.addEventListener("touchmove", drag_id6, { passive: true });
track_id6.addEventListener("mouseup", dragEnd_id6);
track_id6.addEventListener("mouseleave", dragEnd_id6);
track_id6.addEventListener("touchend", dragEnd_id6);

function dragStart_id6(event) {
  isDragging_id6 = true;
  startPos_id6 = getPositionX_id6(event);
  const matrix = window.getComputedStyle(track_id6).transform;
  currentTranslate_id6 = matrix !== "none" ? parseInt(matrix.split(",")[4]) : 0;
  prevTranslate_id6 = currentTranslate_id6;
  track_id6.style.transition = "none";
  animationID_id6 = requestAnimationFrame(animation_id6);
  track_id6.style.cursor = "grabbing";
}

function drag_id6(event) {
  if (isDragging_id6) {
    const currentPosition = getPositionX_id6(event);
    const moveX = currentPosition - startPos_id6;
    currentTranslate_id6 = prevTranslate_id6 + moveX;
  }
}

function animation_id6() {
  if (!isDragging_id6) return;
  track_id6.style.transform = `translateX(${currentTranslate_id6}px)`;
  requestAnimationFrame(animation_id6);
}

function dragEnd_id6() {
  if (!isDragging_id6) return;
  cancelAnimationFrame(animationID_id6);
  isDragging_id6 = false;
  track_id6.style.transition = "transform 0.75s cubic-bezier(0.21, 0.61, 0.35, 1)";
  track_id6.style.cursor = "grab";
  const movedBy = currentTranslate_id6 - prevTranslate_id6;
  const threshold = cardWidth_id6 / 3.5;
  if (movedBy < -threshold && currentIndex_id6 < cards_id6.length - 1) moveToSlide_id6(currentIndex_id6 + 1);
  else if (movedBy > threshold && currentIndex_id6 > 0) moveToSlide_id6(currentIndex_id6 - 1);
  else moveToSlide_id6(currentIndex_id6);
}

function getPositionX_id6(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") moveToSlide_id6(currentIndex_id6 + 1);
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") moveToSlide_id6(currentIndex_id6 - 1);
});

// Resize
window.addEventListener("resize", debounce(() => {
  initializeCarousel_id6();
  moveToSlide_id6(currentIndex_id6);
}, 250));

// Floating effect
function addFloatingEffect_id6() {
  cards_id6.forEach((card, index) => {
    const delay = index * 0.2;
    card.style.animation = `floating_id6 4s ease-in-out ${delay}s infinite`;
  });

  const style = document.createElement("style");
  style.textContent = `
    @keyframes floating_id6 {
      0% { transform: translateY(0px) rotate3d(0,1,0,0deg); }
      50% { transform: translateY(-10px) rotate3d(0,1,0,1deg); }
      100% { transform: translateY(0px) rotate3d(0,1,0,0deg); }
    }
  `;
  document.head.appendChild(style);
}

// Initialize
window.onload = () => {
  initializeCarousel_id6();
  moveToSlide_id6(2);
  addFloatingEffect_id6();
};
