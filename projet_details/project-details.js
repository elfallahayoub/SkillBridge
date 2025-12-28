document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const joinBtn = document.querySelector(".join-btn");

  // Effet sur le bouton
  joinBtn.addEventListener("click", () => {
    joinBtn.textContent = "Demande envoyée ✅";
    joinBtn.style.background = "linear-gradient(135deg, #34d399, #10b981)";
    joinBtn.disabled = true;
  });

  // Animation fade-in au scroll
  const elements = document.querySelectorAll(
    ".project-header, .project-description, .founder-section, .members-section, .actions"
  );

  elements.forEach((el) => el.classList.add("fade-in"));

  const revealOnScroll = () => {
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // pour déclencher à l'ouverture

  // Navbar transparente → colorée au scroll
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  });
});
