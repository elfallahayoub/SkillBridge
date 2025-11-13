document.addEventListener("DOMContentLoaded", () => {
  // Sélectionne tous les boutons "Details"
  const detailButtons = document.querySelectorAll(".join-btn");

  // Ajoute un événement clic à chacun
  detailButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Redirige vers la page project-details.html
      window.location.href = "/projet_details/project-details.html";
    });
  });

  // Animation GSAP (facultatif)
  if (window.gsap) {
    gsap.from(".project-card", { opacity: 0, y: 20, duration: 0.6, stagger: 0.2 });
  }
});
