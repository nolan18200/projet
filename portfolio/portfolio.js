/* ── WIDGET BULLE DÉPLAÇABLE ────────────── */
const bubble = document.getElementById('floatingBubble');
const menuOverlay = document.getElementById('menuOverlay');
const menuCloseBtn = document.getElementById('menuClose');
const menuLinks = document.querySelectorAll('.menu-card a');

let isDragging = false;
let startX, startY, startLeft, startTop;
let hasMoved = false;

// Position initiale sauvegardée
let savedLeft, savedTop;

function savePosition() {
  savedLeft = bubble.style.left || (window.innerWidth - 90) + 'px';
  savedTop = bubble.style.top || (window.innerHeight - 90) + 'px';
}

// Placer la bulle en bas à droite au chargement
function initPosition() {
  bubble.style.left = (window.innerWidth - 90) + 'px';
  bubble.style.top = (window.innerHeight - 120) + 'px';
  bubble.style.right = 'auto';
  bubble.style.bottom = 'auto';
}

initPosition();

// Démarrer le drag
function startDrag(e) {
  isDragging = true;
  hasMoved = false;
  bubble.classList.add('dragging');
  bubble.classList.remove('idle');

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  startX = clientX;
  startY = clientY;
  startLeft = bubble.offsetLeft;
  startTop = bubble.offsetTop;

  e.preventDefault();
}

// Pendant le drag
function drag(e) {
  if (!isDragging) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const dx = clientX - startX;
  const dy = clientY - startY;

  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    hasMoved = true;
  }

  let newLeft = startLeft + dx;
  let newTop = startTop + dy;

  // Limites de l'écran
  const maxLeft = window.innerWidth - bubble.offsetWidth - 10;
  const maxTop = window.innerHeight - bubble.offsetHeight - 10;

  newLeft = Math.max(10, Math.min(newLeft, maxLeft));
  newTop = Math.max(10, Math.min(newTop, maxTop));

  bubble.style.left = newLeft + 'px';
  bubble.style.top = newTop + 'px';
  bubble.style.right = 'auto';
  bubble.style.bottom = 'auto';

  e.preventDefault();
}

// Fin du drag
function endDrag(e) {
  if (!isDragging) return;

  isDragging = false;
  bubble.classList.remove('dragging');
  bubble.classList.add('idle');

  // Si on n'a pas bougé (juste un clic), ouvrir le menu
  if (!hasMoved) {
    openMenu();
  }

  savePosition();
}

// Événements souris
bubble.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);

// Événements tactiles
bubble.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', drag, { passive: false });
document.addEventListener('touchend', endDrag);

// Empêcher le menu de s'ouvrir si on scrolle après un drag
bubble.addEventListener('click', (e) => {
  if (hasMoved) {
    e.stopPropagation();
  }
});

// Animation idle après un court délai
setTimeout(() => {
  bubble.classList.add('idle');
}, 2000);


/* ── MENU OVERLAY ────────────────────────── */
function openMenu() {
  menuOverlay.classList.add('open');
}

function closeMenu() {
  menuOverlay.classList.remove('open');
}

menuCloseBtn.addEventListener('click', closeMenu);

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// Fermer en cliquant en dehors de la carte
menuOverlay.addEventListener('click', (e) => {
  if (e.target === menuOverlay) {
    closeMenu();
  }
});

// Fermer avec la touche Échap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOverlay.classList.contains('open')) {
    closeMenu();
  }
});


/* ── CARROUSEL DYNAMIQUE ─────────────────── */
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

let currentIndex = 0;
let slides = [];
let dots = [];

fetch('images.json')
  .then(response => {
    if (!response.ok) throw new Error('JSON introuvable');
    return response.json();
  })
  .then(images => {
    if (images.length === 0) {
      track.innerHTML = '<div class="carousel-slide" style="display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:18px;">Aucune image pour le moment</div>';
      return;
    }

    images.forEach((src, index) => {
      const slide = document.createElement('div');
      slide.classList.add('carousel-slide');
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Projet ${index + 1}`;
      img.loading = 'lazy';
      slide.appendChild(img);
      track.appendChild(slide);
    });

    slides = Array.from(track.children);

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Aller au projet ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    dots = Array.from(dotsContainer.children);
    updateCarousel();
  })
  .catch(error => {
    track.innerHTML = '<div class="carousel-slide" style="display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:16px;padding:40px;text-align:center;">Erreur de chargement des images</div>';
    console.error('Erreur:', error);
  });

function updateCarousel() {
  if (slides.length === 0) return;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

prevBtn.addEventListener('click', () => {
  if (slides.length === 0) return;
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
});

nextBtn.addEventListener('click', () => {
  if (slides.length === 0) return;
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
});


/* ── SWIPE TACTILE ───────────────────────── */
let touchStartX = 0;
let touchEndX = 0;

track.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

track.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (slides.length === 0) return;
  const diff = touchStartX - touchEndX;
  const threshold = 50;
  if (diff > threshold) {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  } else if (diff < -threshold) {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }
}


/* ── REDIMENSIONNEMENT ───────────────────── */
window.addEventListener('resize', () => {
  const maxLeft = window.innerWidth - bubble.offsetWidth - 10;
  const maxTop = window.innerHeight - bubble.offsetHeight - 10;
  const currentLeft = bubble.offsetLeft;
  const currentTop = bubble.offsetTop;

  if (currentLeft > maxLeft) bubble.style.left = maxLeft + 'px';
  if (currentTop > maxTop) bubble.style.top = maxTop + 'px';
});