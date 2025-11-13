document.addEventListener("DOMContentLoaded", () => {
  // Animation d’apparition fluide
  const elements = document.querySelectorAll(".fade-in");
  const showOnScroll = () => {
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add("visible");
      }
    });
  };
  window.addEventListener("scroll", showOnScroll);
  showOnScroll();

  // Boutons
  window.editProfile = () => {
    alert("Fonctionnalité à venir : modification du profil !");
  };

  window.openProject = () => {
    window.location.href = "../project-details/project-details.html";
  };
});
