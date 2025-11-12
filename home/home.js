// Animation GSAP
window.addEventListener("load", () => {
  gsap.from(".navbar", { y: -80, opacity: 0, duration: 1, ease: "power3.out" });
  gsap.from(".welcome h1", { y: 40, opacity: 0, duration: 1, delay: 0.3 });
  gsap.from(".welcome p", { y: 30, opacity: 0, duration: 1, delay: 0.5 });
  gsap.from(".card", {
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 1,
    delay: 0.8,
    ease: "power3.out"
  });
});

// Nom de l'utilisateur depuis localStorage
const userName = localStorage.getItem("username") || "Étudiant";
document.getElementById("user-name").textContent = userName + " 👋";
document.getElementById("username").textContent = userName;

// Effet scroll sur navbar
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});

// Bouton Messenger (popup temporaire)
document.getElementById("messenger-btn").addEventListener("click", () => {
  alert("Fonctionnalité Messenger à venir 💬");
});
