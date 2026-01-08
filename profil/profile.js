document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return window.location.href = "../login/login.html";
  }

  // ===== Infos utilisateur =====
  document.getElementById("username").textContent =
    `${user.nom} ${user.prenom || ""}`;

  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("emailValue").textContent = user.email;
  document.getElementById("fullname").textContent =
    `${user.nom} ${user.prenom || ""}`;

  document.getElementById("specialite").textContent =
    user.specialite || "—";

  document.getElementById("numEtudiant").textContent =
    user.numeroEtudiant || "—";

  document.getElementById("level").textContent =
    user.niveau || "—";

  if (user.photo) {
    document.getElementById("profilePhoto").src = user.photo;
  }

  // ===== Bouton créer projet =====
  document.getElementById("createProjectBtn")
    .addEventListener("click", () => {
      window.location.href = "../create_project/create-project.html";
    });

  // ===== Projets (à charger depuis API plus tard) =====
  const projectsGrid = document.getElementById("projectsGrid");

  projectsGrid.innerHTML = `
    <div class="project-card">
      <h3>—</h3>
      <p>Aucun projet pour le moment</p>
    </div>
  `;
});
