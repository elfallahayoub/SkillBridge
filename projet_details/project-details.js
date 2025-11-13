document.addEventListener("DOMContentLoaded", () => {
  // Effet scroll navbar
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  });

  // Effet sur bouton rejoindre
  const joinBtn = document.querySelector(".join-btn");
  joinBtn.addEventListener("click", () => {
    joinBtn.textContent = "Demande envoyée ✅";
    joinBtn.style.background = "linear-gradient(135deg, #34d399, #10b981)";
    joinBtn.disabled = true;
  });
});
