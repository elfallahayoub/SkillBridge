// Exemple simple pour charger les infos depuis le localStorage
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username") || "Utilisateur";
  const email = localStorage.getItem("email") || "email@example.com";
  const bio = localStorage.getItem("bio") || "Aucune bio pour le moment.";

  document.getElementById("username").textContent = username;
  document.getElementById("email").textContent = email;
  document.getElementById("bio").textContent = bio;

  // Déconnexion
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/login/login.html";
  });

  // Exemple de chargement de projets
  const userProjects = [
    { title: "Plateforme de mentoring", description: "Connecte étudiants et experts." },
    { title: "Application de gestion d'événements", description: "Créée avec React et Node.js." }
  ];

  const projectContainer = document.getElementById("userProjects");
  userProjects.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `<h4>${p.title}</h4><p>${p.description}</p>`;
    projectContainer.appendChild(card);
  });
});
