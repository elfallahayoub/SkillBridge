document.addEventListener("DOMContentLoaded", () => {


  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in → redirect
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  // Inject user data into profile
  document.getElementById("username").textContent =
    `${user.prenom} ${user.nom}`;

  document.getElementById("user-email").textContent =
    user.email;

  document.getElementById("fullname").textContent =
    `${user.nom} ${user.prenom}`;

  document.getElementById("university").textContent =
    user.university || "ESISA";

  document.getElementById("numEtudiant").textContent =
    user.nom || "nom";

  document.getElementById("level").textContent =
    user.level || "3ᵉ année IL";


  /* ============================
     ✨ ANIMATIONS (UNCHANGED)
  ============================ */
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


  /* ============================
     🔘 BUTTONS (UNCHANGED)
  ============================ */
  window.editProfile = () => {
    alert("Fonctionnalité à venir : modification du profil !");
  };

  window.openProject = () => {
    window.location.href = "../project-details/project-details.html";
  };

});
