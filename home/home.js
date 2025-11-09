document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.getElementById("projects");
  const addBtn = document.getElementById("addProject");
  const modal = document.getElementById("projectModal");
  const closeModal = document.getElementById("closeModal");
  const form = document.getElementById("projectForm");
  const search = document.getElementById("search");
  const logout = document.getElementById("logout");

  let projects = JSON.parse(localStorage.getItem("projects")) || [];

  function renderProjects(list = projects) {
    projectsContainer.innerHTML = "";
    if(list.length === 0){
      projectsContainer.innerHTML = "<p class='muted'>Aucun projet pour le moment.</p>";
      return;
    }
    list.forEach(p => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tags">${p.skills.split(',').map(s=>`<span class='tag'>${s.trim()}</span>`).join('')}</div>
        <div class="project-author">👤 Publié par ${p.author}</div>
      `;
      projectsContainer.appendChild(card);
    });
  }

  renderProjects();

  // Modal control
  addBtn.addEventListener("click", ()=> modal.classList.remove("hidden"));
  closeModal.addEventListener("click", ()=> modal.classList.add("hidden"));

  // Submit new project
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const newProject = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      skills: form.skills.value.trim(),
      author: JSON.parse(localStorage.getItem("user"))?.name || "Anonyme"
    };
    projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));
    modal.classList.add("hidden");
    form.reset();
    renderProjects();
    gsap.from(".project-card:last-child", {opacity:0,y:20,duration:0.4});
  });

  // Recherche
  search.addEventListener("input", (e)=>{
    const term = e.target.value.toLowerCase();
    const filtered = projects.filter(p => 
      p.title.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term) ||
      p.skills.toLowerCase().includes(term)
    );
    renderProjects(filtered);
  });

  // Logout
  logout.addEventListener("click", ()=>{
    localStorage.removeItem("user");
    window.location.href = "../login/login.html";
  });

  // Animation d'entrée
  gsap.from(".navbar", {y:-40,opacity:0,duration:0.6,ease:"power3.out"});
  gsap.from(".project-card", {opacity:0,y:20,stagger:0.1,duration:0.5});
});
