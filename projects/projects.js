document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const projectsGrid = document.getElementById("projectsGrid");

  /* ================= CONFIG ================= */
  const API_BASE = "http://localhost:4001";
  const FETCH_TIMEOUT = 5000;

  /* ================= FETCH WITH TIMEOUT ================= */
  function fetchWithTimeout(resource, options = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    return fetch(resource, {
      ...options,
      signal: controller.signal,
    }).finally(() => clearTimeout(id));
  }

  /* ================= LOAD PROJECTS ================= */
  async function loadProjects() {
    const url = `${API_BASE}/api/projects/getAllProjects`;

    try {
      const res = await fetchWithTimeout(url);

      if (!res.ok) {
        projectsGrid.innerHTML =
          "<p>Impossible de charger les projets pour le moment.</p>";
        return;
      }

      const data = await res.json();
      const projects = Array.isArray(data) ? data : data.projects || [];

      renderProjects(projects);
    } catch (err) {
      console.error("Erreur chargement projets :", err);
      projectsGrid.innerHTML =
        "<p>Impossible de charger les projets pour le moment.</p>";
    }
  }

  /* ================= RENDER PROJECTS ================= */
  function renderProjects(projects) {
    if (!projects.length) {
      projectsGrid.innerHTML = "<p>Aucun projet disponible.</p>";
      return;
    }

    projectsGrid.innerHTML = projects
      .map((p) => {
        const date = p.createdAt
          ? new Date(p.createdAt).toLocaleDateString("fr-FR")
          : "-";

        const founder = p.owner
          ? `${p.owner.nom || ""} ${p.owner.prenom || ""}`.trim()
          : "Inconnu";

        const membersHtml =
          Array.isArray(p.members) && p.members.length
            ? `
              <ul class="member-list">
                ${p.members
                  .map((m) => {
                    if (!m) return "<li>Inconnu</li>";
                    if (typeof m === "string")
                      return `<li>${escapeHtml(m)}</li>`;

                    const name = `${m.nom || ""} ${m.prenom || ""}`.trim();
                    return `<li>${escapeHtml(name || "Membre")}</li>`;
                  })
                  .join("")}
              </ul>
            `
            : "<span>Aucun membre listé</span>";

        return `
          <article class="project-card">
            <h3>${escapeHtml(p.title)}</h3>

            <p class="founder">
              👤 Fondateur : <strong>${escapeHtml(founder)}</strong>
            </p>

            <p class="date">
              📅 Créé le : <strong>${date}</strong>
            </p>

            <p class="members">👥 Membres :</p>
            ${membersHtml}

            <p class="desc">${escapeHtml(p.description || "")}</p>

            <button class="join-btn" data-id="${p._id}">
              Voir le projet
            </button>
          </article>
        `;
      })
      .join("");

    /* ===== BUTTON CLICK ===== */
    document.querySelectorAll(".join-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        window.location.href = `/projet_details/project-details.html?id=${id}`;
      });
    });
  }

  /* ================= ESCAPE HTML ================= */
  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (s) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[s]);
  }

  /* ================= BURGER MENU ================= */
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  /* ================= INIT ================= */
  loadProjects();
});
