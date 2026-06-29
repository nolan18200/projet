// Redirection automatique vers l'accueil après 10 secondes
let countdown = 10;
const interval = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
        clearInterval(interval);
        window.location.href = "/index.html";
    }
}, 1000);
