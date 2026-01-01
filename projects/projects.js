document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const buttons = document.querySelectorAll(".join-btn");
  const projectsGrid = document.getElementById("projectsGrid");
  if (!projectsGrid) {
    console.error('projectsGrid element not found — check that #projectsGrid exists in HTML');
  }

  // Fetch projects from backend and render
  // Force using the backend on localhost:4001
  const API_BASE = 'http://localhost:4001';
  const FETCH_TIMEOUT = 5000; // ms

  function fetchWithTimeout(resource, options = {}) {
    const { timeout = FETCH_TIMEOUT } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    return fetch(resource, { ...options, signal: controller.signal })
      .finally(() => clearTimeout(id));
  }

  async function loadProjects() {
    const url = `${API_BASE}/api/projects/getAllProjects`;
    console.log('Fetching projects from', url);
    try {
      const res = await fetchWithTimeout(url, { timeout: FETCH_TIMEOUT });
      console.log('Response from', url, 'status', res.status);
      if (!res.ok) {
        console.warn('Request to', url, 'failed with status', res.status);
        if (projectsGrid) projectsGrid.innerHTML = '<p>Impossible de charger les projets pour le moment.</p>';
        return;
      }
      const payload = await res.json();
      // API may return paginated { total, page, limit, projects }
      const projects = Array.isArray(payload) ? payload : (Array.isArray(payload.projects) ? payload.projects : []);
      console.log('Fetched', projects.length, 'projects from', url);
      renderProjects(projects);
    } catch (err) {
      console.warn('Request to', url, 'failed:', err && err.name ? err.name : err.message);
      if (projectsGrid) projectsGrid.innerHTML = '<p>Impossible de charger les projets pour le moment.</p>';
    }
  }

  function renderProjects(projects) {
    if (!projects || projects.length === 0) {
      projectsGrid.innerHTML = '<p>Aucun projet publié pour l\'instant.</p>';
      return;
    }

    projectsGrid.innerHTML = projects.map(p => {
      const date = p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '-';
      const founder = p.owner ? `${p.owner.nom || ''} ${p.owner.prenom || ''}`.trim() : 'Inconnu';
      const membersHtml = (Array.isArray(p.members) && p.members.length)
        ? `<ul class="member-list">${p.members.map(m => {
            // member can be populated object or plain id string
            if (!m) return '<li>Inconnu</li>';
            if (typeof m === 'string') return `<li>${escapeHtml(m)}</li>`;
            const name = `${m.nom || ''} ${m.prenom || ''}`.trim();
            return `<li>${escapeHtml(name || (m._id || 'Membre'))}</li>`;
          }).join('')}</ul>`
        : '<span>Aucun membre listé</span>';

      return `
        <div class="project-card" data-id="${p._id}">
          <h3>${escapeHtml(p.title)}</h3>
          <p class="founder">👤 Fondateur : <strong>${escapeHtml(founder)}</strong></p>
          <p class="date">📅 Créé le : <strong>${date}</strong></p>
          <p class="members">👥 Membres :</p>
          ${membersHtml}
          <p class="desc">${escapeHtml(p.description || '')}</p>
          <button class="join-btn" data-id="${p._id}">Voir le projet</button>
        </div>
      `;
    }).join('');

    // Attach click handlers to buttons
    document.querySelectorAll('.join-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        window.location.href = `/projet_details/project-details.html?id=${id}`;
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"'`]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;',"`":'&#96;'})[s]);
  }

  loadProjects();

  // Menu burger mobile
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Redirection vers page détail projet
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = "/projet_details/project-details.html";
    });
  });
});
