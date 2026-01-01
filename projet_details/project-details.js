document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const joinBtn = document.querySelector('.join-btn');
  const projectTitle = document.getElementById('projectTitle');
  const projectTagline = document.getElementById('projectTagline');
  const projectDescription = document.getElementById('projectDescription');
  const founderName = document.getElementById('founderName');
  const founderBio = document.getElementById('founderBio');
  const founderImg = document.getElementById('founderImg');
  const membersList = document.getElementById('membersList');

  const API_BASE = 'http://localhost:4001';

  // Keep the nice button effect
  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      joinBtn.textContent = 'Demande envoyée ✅';
      joinBtn.style.background = 'linear-gradient(135deg, #34d399, #10b981)';
      joinBtn.disabled = true;
    });
  }

  // Simple helpers
  const q = (name) => new URLSearchParams(window.location.search).get(name);

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error: ' + res.status);
    return res.json();
  }

  function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';
    const img = document.createElement('img');
    img.src = '/assets/images/default-avatar.png';
    img.alt = 'member';
    const h4 = document.createElement('h4');
    const p = document.createElement('p');

    if (!member) h4.textContent = 'Inconnu';
    else if (typeof member === 'string') h4.textContent = member;
    else h4.textContent = `${member.nom || ''} ${member.prenom || ''}`.trim() || (member._id || 'Membre');

    card.appendChild(img);
    card.appendChild(h4);
    card.appendChild(p);
    return card;
  }

  async function loadProject() {
    const id = q('id');
    if (!id) {
      if (projectTitle) projectTitle.textContent = 'Projet non spécifié';
      return;
    }

    try {
      const project = await fetchJson(`${API_BASE}/api/projects/getProject/${id}`);

      if (projectTitle) projectTitle.textContent = project.title || 'Sans titre';
      if (projectTagline) projectTagline.textContent = project.category ? `Catégorie: ${project.category}` : '';
      if (projectDescription) projectDescription.textContent = project.description || '';

      if (project.owner) {
        const owner = typeof project.owner === 'string' ? { _id: project.owner } : project.owner;
        if (founderName) founderName.textContent = `${owner.nom || ''} ${owner.prenom || ''}`.trim() || 'Inconnu';
        if (founderBio) founderBio.textContent = owner.bio || '';
        if (owner.profileImage && founderImg) founderImg.src = owner.profileImage;
      } else {
        if (founderName) founderName.textContent = 'Inconnu';
      }

      if (membersList) {
        membersList.innerHTML = '';
        if (Array.isArray(project.members) && project.members.length) {
          project.members.forEach((m) => membersList.appendChild(createMemberCard(m)));
        } else {
          membersList.innerHTML = '<p>Aucun membre inscrit.</p>';
        }
      }
    } catch (err) {
      console.error('Failed to load project', err);
      if (projectTitle) projectTitle.textContent = 'Impossible de charger le projet';
      if (membersList) membersList.innerHTML = '<p>Erreur lors du chargement des membres.</p>';
    }
  }

  loadProject();

  // reveal animation: reuse existing selectors if present
  const elements = document.querySelectorAll('.project-header, .project-description, .founder-section, .members-section, .actions');
  elements.forEach((el) => el.classList.add('fade-in'));
  const revealOnScroll = () => {
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) el.classList.add('visible');
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // Navbar color on scroll
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
});
