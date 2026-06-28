
/* ── MOBILE MENU ─────────────────────────── */
const mobileMenu   = document.getElementById('mobileMenu');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuCloseBtn = document.getElementById('menuClose');
const menuLinks    = document.querySelectorAll('.mobile-menu a');

hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.add('open');
});

menuCloseBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
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

  // UI loading
  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ Envoi en cours...";

  // récupération des données (sécurisé)
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

  // reset bouton
  submitBtn.disabled = false;
  submitBtn.textContent = "Envoyer ma commande →";
});