const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // ✅ On ajoute une classe CSS au lieu de modifier le style inline
            // → évite le conflit avec le transform du hover
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // stop d'observer une fois visible
        }
    });
}, { threshold: 0.15 });

cards.forEach(card => {
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
});
