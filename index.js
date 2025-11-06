// Exemple de gestion d'annonces simples (stockées localement)
const projectList = document.getElementById("project-list");
const addProjectBtn = document.getElementById("addProjectBtn");

// Exemple de données
const projects = [
  { title: "Plateforme de e-learning", author: "Sara", tech: ["React", "Node.js"], desc: "Création d'une plateforme pour cours en ligne." },
  { title: "Application mobile santé", author: "Ayoub", tech: ["Flutter", "Firebase"], desc: "Suivi de la santé des étudiants." },
  { title: "Projet IA d'analyse de texte", author: "Lberni", tech: ["Python", "NLP"], desc: "Analyse automatique de feedback étudiants." }
];

// Affiche les projets sur la page
function renderProjects() {
  projectList.innerHTML = "";
  projects.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("project-card");
    card.innerHTML = `
      <h4>${p.title}</h4>
      <p><strong>Auteur :</strong> ${p.author}</p>
      <p>${p.desc}</p>
      <p><strong>Technologies :</strong> ${p.tech.join(", ")}</p>
      <button class="btn-secondary">Demander à rejoindre</button>
    `;
    projectList.appendChild(card);
  });
}

addProjectBtn.addEventListener("click", () => {
  alert("Formulaire de publication à venir !");
});

renderProjects();
