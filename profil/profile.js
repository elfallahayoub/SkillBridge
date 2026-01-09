function goToModify() {
  window.location.href = "../modify/modify.html";
}

function createProject() {
  window.location.href = "../create_project/create-project.html";
}

document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  // NOM UTILISATEUR
  const usernameEl = document.getElementById("username");
  if (usernameEl)
    usernameEl.textContent = `${user.prenom || ""} ${user.nom || ""}`;

  // NOM COMPLET
  const fullNameEl = document.getElementById("fullname");
  if (fullNameEl)
    fullNameEl.textContent = `${user.nom || ""} ${user.prenom || ""}`;

  // EMAIL
  const emailEl = document.getElementById("email");
  if (emailEl)
    emailEl.textContent = user.email || "";

  // SPECIALITE
  const specEl = document.getElementById("specialite");
  if (specEl)
    specEl.textContent = user.specialite || "—";

  const uniEl = document.getElementById("university");
  if (uniEl)
    uniEl.textContent = user.university || "—";

  // NIVEAU
  const niveauEl = document.getElementById("level");
  if (niveauEl)
    niveauEl.textContent = user.niveau || "—";

  // NUMERO ETUDIANT
  const numEtuEl = document.getElementById("numEtudiant");
  if (numEtuEl)
    numEtuEl.textContent = user.numeroEtudiant || "—";

// PHOTO
const profilePic = document.getElementById("profilePhoto");

if (user.photo && user.photo.startsWith("/uploads/")) {
  profilePic.src = "http://localhost:4001" + user.photo;
} else {
  profilePic.src =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
}




  // Animation
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
});
