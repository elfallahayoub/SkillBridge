document.addEventListener("DOMContentLoaded", () => {
  const exploreBtn = document.querySelector(".cta-btn");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  // Redirection vers la page des projets
  exploreBtn.addEventListener("click", () => {
    window.location.href = "/projects/projects.html";
  });

  // Menu burger mobile
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});