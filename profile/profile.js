document.addEventListener("DOMContentLoaded", () => {
  // Exemple de données (normalement, tu les récupéreras depuis la base de données)
  const user = {
    name: "Ayoub El Fallah",
    bio: "Étudiant passionné par le développement web et l’intelligence artificielle.",
    skills: ["React", "Node.js", "Python"],
    currentProjects: [
      { title: "Application de gestion des tâches", desc: "Projet en React & Firebase" },
      { title: "Bot Discord Éducatif", desc: "Utilise l’IA pour aider les étudiants" }
    ],
    pastProjects: [
      { title: "Portfolio personnel", desc: "HTML, CSS, JavaScript" },
      { title: "Plateforme de quiz", desc: "Node.js et Express" }
    ]
  };

  // Injecter les données dans la page
  document.getElementById("studentName").textContent = user.name;
  document.getElementById("studentBio").textContent = user.bio;

  const current = document.getElementById("current-projects");
  const past = document.getElementById("past-projects");

  user.currentProjects.forEach(p => {
    current.innerHTML += `
      <div class="project-card">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    `;
  });

  user.pastProjects.forEach(p => {
    past.innerHTML += `
      <div class="project-card">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    `;
  });
});
