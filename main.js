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
/* ── SCROLL REVEAL ───────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.service-card, .pricing-wrapper, .portfolio-card, .form-step'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});


/* ── FORMULAIRE + POPUP ───────────────────────── */
const form = document.getElementById("orderForm");
const submitBtn = document.querySelector(".submit-btn");
const popup = document.getElementById("popup");

if (form && submitBtn && popup) {

  function showPopup(message, type) {
    popup.textContent = message;
    popup.className = "popup " + type;
    popup.classList.remove("hidden");
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 3000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Envoi en cours...";

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        showPopup("✔️ Commande envoyée avec succès", "success");
        form.reset();
      } else {
        showPopup("❌ Erreur lors de l'envoi", "error");
      }
    } catch (error) {
      showPopup("❌ Impossible de contacter le serveur", "error");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Envoyer ma commande →";
  });

}