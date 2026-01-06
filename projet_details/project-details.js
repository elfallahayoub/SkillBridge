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

  // Current authenticated user (saved at login)
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (e) { return null; }
  })();

  // Keep the nice button effect
  if (joinBtn) {
    joinBtn.addEventListener('click', async () => {
      if (!currentUser) {
        alert('Veuillez vous connecter pour demander à rejoindre le projet.');
        return window.location.href = '../login/login.html';
      }

      joinBtn.disabled = true;
      joinBtn.textContent = 'Envoi...';

      try {
        const id = new URLSearchParams(window.location.search).get('id');
        const res = await fetch(`${API_BASE}/api/projects/${id}/requestJoin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser._id })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Erreur');

        joinBtn.textContent = 'Demande envoyée ✅';
        joinBtn.style.background = 'linear-gradient(135deg, #34d399, #10b981)';
      } catch (err) {
        console.error('Join request failed', err);
        joinBtn.disabled = false;
        joinBtn.textContent = 'Demander à rejoindre';
        alert('Impossible d\'envoyer la demande. Réessayez.');
      }
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

      // Disable/hide join button for owner or existing members
      if (joinBtn) {
        // Build identifier candidates from current user (support _id, numeroEtudiant, email)
        const getUserCandidates = (u) => {
          if (!u) return [];
          const cand = [];
          if (u._id) cand.push(u._id.toString());
          if (u.numeroEtudiant) cand.push(String(u.numeroEtudiant));
          if (u.email) cand.push(String(u.email).toLowerCase());
          return cand.filter(Boolean);
        };

        const currentCandidates = getUserCandidates(currentUser);

        // Build owner candidates (owner may be populated object or id string)
        const ownerCandidates = (() => {
          const o = project.owner;
          if (!o) return [];
          if (typeof o === 'string') return [o.toString()];
          const arr = [];
          if (o._id) arr.push(o._id.toString());
          if (o.numeroEtudiant) arr.push(String(o.numeroEtudiant));
          if (o.email) arr.push(String(o.email).toLowerCase());
          return arr.filter(Boolean);
        })();

        const isOwner = currentCandidates.length && ownerCandidates.length && currentCandidates.some(c => ownerCandidates.includes(c));

        // Check members: each member may be id string or populated object
        const isMember = (() => {
          if (!currentCandidates.length || !Array.isArray(project.members)) return false;
          return project.members.some(m => {
            if (!m) return false;
            const memberCandidates = [];
            if (typeof m === 'string') memberCandidates.push(m.toString());
            else {
              if (m._id) memberCandidates.push(m._id.toString());
              if (m.numeroEtudiant) memberCandidates.push(String(m.numeroEtudiant));
              if (m.email) memberCandidates.push(String(m.email).toLowerCase());
            }
            return currentCandidates.some(c => memberCandidates.includes(c));
          });
        })();

        // Debug info: helps identify mismatched id formats
        console.debug('Project load debug:', {
          currentCandidates,
          ownerCandidates,
          projectMembers: Array.isArray(project.members) ? project.members.map(m => {
            if (!m) return null;
            if (typeof m === 'string') return m.toString();
            return {
              _id: m._id && m._id.toString(),
              numeroEtudiant: m.numeroEtudiant,
              email: m.email && String(m.email).toLowerCase()
            };
          }) : project.members,
          isOwner,
          isMember
        });

        if (isOwner) {
          joinBtn.style.display = 'none';
        } else if (isMember) {
          joinBtn.textContent = 'Déjà membre';
          joinBtn.disabled = true;
          joinBtn.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
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
