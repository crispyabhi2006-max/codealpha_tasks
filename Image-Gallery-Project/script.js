/* =========================================================
   PHOTO DATA
   ========================================================= */
const PHOTOS = [
  { id: 1,  category: "mountain", title: "Ridge Line at Dawn",      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", size: "tall"  },
  { id: 2,  category: "coast",    title: "Low Tide, Long Exposure", src: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=1200&q=80", size: "wide"  },
  { id: 3,  category: "desert",   title: "Dune Shadows, Noon",      src: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200&q=80", size: ""      },
  { id: 4,  category: "forest",   title: "Canopy Light",            src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80", size: ""      },
  { id: 5,  category: "urban",    title: "Glass & Grid",            src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80", size: "tall"  },
  { id: 6,  category: "mountain", title: "Switchback Trail",        src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80", size: ""      },
  { id: 7,  category: "coast",    title: "Cliffs, Morning Fog",     src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80", size: ""      },
  { id: 8,  category: "desert",   title: "Salt Flat Horizon",       src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&q=80", size: "wide"  },
  { id: 9,  category: "forest",   title: "Fog Between Trunks",      src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80", size: ""      },
  { id: 10, category: "urban",    title: "Night Crossing",          src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80&sat=-100", size: "" },
  { id: 11, category: "mountain", title: "Alpine Lake, Stillwater", src: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=1200&q=80", size: "wide"  },
  { id: 12, category: "forest",   title: "First Snow",              src: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1200&q=80", size: "tall"  },
];

/* =========================================================
   STATE
   ========================================================= */
let currentFilter = "all";
let visibleList = [...PHOTOS];
let activeIndex = 0;

/* =========================================================
   DOM REFERENCES
   ========================================================= */
const galleryEl    = document.getElementById("gallery");
const filterBar     = document.getElementById("filterBar");
const emptyState    = document.getElementById("emptyState");

const lightbox      = document.getElementById("lightbox");
const lbImage         = document.getElementById("lbImage");
const lbTitle         = document.getElementById("lbTitle");
const lbTag           = document.getElementById("lbTag");
const lbProgressFill  = document.getElementById("lbProgressFill");
const lbClose         = document.getElementById("lbClose");
const lbPrev          = document.getElementById("lbPrev");
const lbNext          = document.getElementById("lbNext");

/* =========================================================
   SCROLL REVEAL — tiles fade/slide in as they enter the viewport
   ========================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

/* =========================================================
   RENDER: build gallery tiles from data (DOM manipulation)
   ========================================================= */
function renderGallery(filter){
  galleryEl.innerHTML = "";

  const matches = PHOTOS.filter(p => filter === "all" || p.category === filter);
  visibleList = matches;

  emptyState.hidden = matches.length > 0;

  matches.forEach((photo, index) => {
    const tile = document.createElement("article");
    tile.className = `tile ${photo.size ? "is-" + photo.size : ""}`.trim();
    tile.dataset.id = photo.id;
    tile.tabIndex = 0;
    tile.setAttribute("role", "button");
    tile.setAttribute("aria-label", `Open ${photo.title} in viewer`);
    tile.style.transitionDelay = `${Math.min(index, 8) * 40}ms`;

    tile.innerHTML = `
      <img src="${photo.src}" alt="${photo.title}" loading="lazy">
      <div class="tile-caption">
        <span class="ttl">${photo.title}</span>
        <span class="tag">${photo.category}</span>
      </div>
    `;

    // EVENT HANDLING: open lightbox on click or Enter/Space
    tile.addEventListener("click", () => openLightbox(index));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });

    galleryEl.appendChild(tile);
    revealObserver.observe(tile);
  });

  updateCounts();
}

/* =========================================================
   FILTER COUNTS
   ========================================================= */
function updateCounts(){
  const counts = { all: PHOTOS.length };
  PHOTOS.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
  Object.entries(counts).forEach(([key, val]) => {
    const el = document.getElementById(`count-${key}`);
    if (el) el.textContent = ` (${val})`;
  });
}

/* =========================================================
   FILTER BAR — event delegation
   ========================================================= */
filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");

  currentFilter = btn.dataset.filter;
  renderGallery(currentFilter);
});

/* =========================================================
   LIGHTBOX / IMAGE SLIDER
   ========================================================= */
function openLightbox(index){
  activeIndex = index;
  paintFrame();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lbClose.focus();
}

function closeLightbox(){
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function paintFrame(){
  const photo = visibleList[activeIndex];
  lbImage.src = photo.src;
  lbImage.alt = photo.title;
  lbTitle.textContent = photo.title;
  lbTag.textContent = photo.category;
  const pct = ((activeIndex + 1) / visibleList.length) * 100;
  lbProgressFill.style.width = `${pct}%`;
}

function showNext(){
  activeIndex = (activeIndex + 1) % visibleList.length;
  paintFrame();
}
function showPrev(){
  activeIndex = (activeIndex - 1 + visibleList.length) % visibleList.length;
  paintFrame();
}

lbClose.addEventListener("click", closeLightbox);
lbNext.addEventListener("click", showNext);
lbPrev.addEventListener("click", showPrev);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// KEYBOARD EVENT HANDLING
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft")  showPrev();
  if (e.key === "Escape")     closeLightbox();
});

// TOUCH SWIPE
let touchStartX = null;
lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener("touchend", (e) => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) {
    dx < 0 ? showNext() : showPrev();
  }
  touchStartX = null;
}, { passive: true });

/* =========================================================
   INIT
   ========================================================= */
renderGallery("all");