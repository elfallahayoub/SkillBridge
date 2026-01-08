document.addEventListener('DOMContentLoaded', () => {
  const API = 'http://localhost:4001';
  const projectId = new URLSearchParams(window.location.search).get('id');

  const user = JSON.parse(localStorage.getItem('user'));

  const title = document.getElementById('projectTitle');
  const desc = document.getElementById('projectDescription');
  const tagline = document.getElementById('projectTagline');
  const founderName = document.getElementById('founderName');
  const membersList = document.getElementById('membersList');
  const joinBtn = document.querySelector('.join-btn');

  let projectData = null;

  // ===== Carte membre (effets CSS conservés) =====
  const memberCard = m => {
    const div = document.createElement('div');
    div.className = 'member-card';
    div.innerHTML = `
      <img src="/assets/images/default-avatar.png" class="member-avatar">
      <h4>${m.nom || ''} ${m.prenom || ''}</h4>
    `;
    return div;
  };

  // ===== Charger projet =====
  async function loadProject() {
    try {
      const res = await fetch(`${API}/api/projects/getProject/${projectId}`);
      projectData = await res.json();

      title.textContent = projectData.title;
      desc.textContent = projectData.description;
      tagline.textContent = projectData.category;

      // Fondateur
      if (projectData.owner) {
        founderName.textContent =
          `${projectData.owner.nom} ${projectData.owner.prenom}`;

        // cacher bouton si fondateur 
        if (user && user._id === projectData.owner._id) {
          joinBtn.style.display = 'none';
        }
      }

      // Membres
      membersList.innerHTML = '';
      projectData.members.forEach(m =>
        membersList.appendChild(memberCard(m))
      );

      // Désactiver bouton si déjà membre
      if (user && projectData.members.some(m => m._id === user._id)) {
        joinBtn.textContent = 'Déjà membre';
        joinBtn.disabled = true;
      }

    } catch (err) {
      title.textContent = 'Erreur de chargement';
      console.error(err);
    }
  }

  // ===== Rejoindre projet (via updateProject) =====
  if (joinBtn) {
    joinBtn.addEventListener('click', async () => {
      if (!user) {
        alert('Veuillez vous connecter');
        return location.href = '../login/login.html';
      }

      joinBtn.disabled = true;
      joinBtn.textContent = 'Envoi...';

      try {
        const membersIds = projectData.members.map(m => m._id);
        membersIds.push(user._id);

        await fetch(`${API}/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: membersIds })
        });

        joinBtn.textContent = 'Ajouté ✅';
        loadProject(); // refresh UI

      } catch (e) {
        joinBtn.disabled = false;
        joinBtn.textContent = '🤝 Rejoindre le projet';
        alert('Erreur');
      }
    });
  }

  loadProject();
});
