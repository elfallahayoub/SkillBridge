document.addEventListener("DOMContentLoaded", function() {
  // ===== CONFIGURATION =====
  const API_BASE = "http://localhost:4001";
  const projectsGrid = document.getElementById("projectsGrid");
  const searchInput = document.getElementById("search");
  const refreshBtn = document.getElementById("refreshBtn");

  // ===== VARIABLES GLOBALES =====
  let allProjects = [];

  // ===== CHARGER LES PROJETS =====
  async function loadProjects() {
    showLoading();
    
    try {
      const response = await fetch(`${API_BASE}/api/projects/getAllProjects`);
      
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      
      const projects = await response.json();
      allProjects = projects;
      displayProjects(projects);
      
    } catch (error) {
      console.error('Erreur:', error);
      showError();
    }
  }

  // ===== AFFICHER LES PROJETS =====
  function displayProjects(projects) {
    if (projects.length === 0) {
      projectsGrid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>Aucun projet disponible</h3>
          <p>Soyez le premier à créer un projet !</p>
        </div>
      `;
      return;
    }

    projectsGrid.innerHTML = projects.map(project => `
      <div class="project-card">
        <h3>${escapeHtml(project.title)}</h3>
        
        <div class="project-info">
          <p><i class="fas fa-user-tie"></i> Fondateur: 
            <strong>${getUserName(project.owner)}</strong>
          </p>
          
          <p><i class="far fa-calendar"></i> Créé le: 
            <strong>${formatDate(project.createdAt)}</strong>
          </p>
          
          ${project.category ? `
            <p><i class="fas fa-tag"></i> Catégorie: 
              <strong>${escapeHtml(project.category)}</strong>
            </p>
          ` : ''}
        </div>
        
        <div class="members">
          <p><i class="fas fa-users"></i> Membres (${project.members.length})</p>
          ${project.members.slice(0, 3).map(member => `
            <div class="member-item">
              <div class="member-avatar">${getInitials(getUserName(member))}</div>
              <span>${getUserName(member)}</span>
            </div>
          `).join('')}
          ${project.members.length > 3 ? 
            `<p>... et ${project.members.length - 3} autres</p>` : ''}
        </div>
        
        <div class="project-description">
          <p>${escapeHtml(project.description.substring(0, 150))}...</p>
        </div>
        
        <div class="card-buttons">
          <button class="view-btn" onclick="viewProject('${project._id}')">
            <i class="fas fa-eye"></i> Voir
          </button>
          <button class="join-btn" onclick="joinProject('${project._id}')">
            <i class="fas fa-user-plus"></i> Rejoindre
          </button>
        </div>
      </div>
    `).join('');
  }

  // ===== RECHERCHE =====
  function setupSearch() {
    searchInput.addEventListener('input', function() {
      const searchText = this.value.toLowerCase().trim();
      
      if (!searchText) {
        displayProjects(allProjects);
        return;
      }
      
      const filtered = allProjects.filter(project => {
        const title = project.title?.toLowerCase() || '';
        const description = project.description?.toLowerCase() || '';
        const category = project.category?.toLowerCase() || '';
        
        return title.includes(searchText) || 
               description.includes(searchText) ||
               category.includes(searchText);
      });
      
      displayProjects(filtered);
    });
  }

  // ===== FONCTIONS UTILITAIRES =====
  function getUserName(user) {
    if (!user) return 'Inconnu';
    if (typeof user === 'string') return 'Utilisateur';
    return `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Utilisateur';
  }

  function getInitials(name) {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  function formatDate(dateString) {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ===== AFFICHAGE DES ÉTATS =====
  function showLoading() {
    projectsGrid.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Chargement des projets...</p>
      </div>
    `;
  }

  function showError() {
    projectsGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Erreur de chargement</h3>
        <p>Impossible de charger les projets</p>
        <button onclick="location.reload()" style="
          margin-top: 15px;
          padding: 10px 20px;
          background: #60a5fa;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        ">
          Réessayer
        </button>
      </div>
    `;
  }

  // ===== FONCTIONS GLOBALES =====
  window.viewProject = function(projectId) {
    window.location.href = `/projet_details/project-details.html?id=${projectId}`;
  };

  window.joinProject = function(projectId) {
    // Stocker l'ID du projet dans localStorage
    localStorage.setItem('selectedProjectId', projectId);
    
    // Rediriger vers la page de demande
    window.location.href = '/join-request/join-request.html';
    
    // OU faire une requête directe
    // fetch(`${API_BASE}/api/projects/${projectId}/requestJoin`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId: 'VOTRE_ID_UTILISATEUR' })
    // })
    // .then(response => response.json())
    // .then(data => {
    //   alert('Demande envoyée avec succès !');
    // })
    // .catch(error => {
    //   alert('Erreur lors de la demande');
    // });
  };

  // ===== ÉVÉNEMENTS =====
  refreshBtn.addEventListener('click', loadProjects);

  // Menu burger (si nécessaire)
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // ===== INITIALISATION =====
  loadProjects();
  setupSearch();
});