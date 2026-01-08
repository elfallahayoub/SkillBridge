document.addEventListener("DOMContentLoaded", () => {

  /* ================== CONFIG ================== */
  const API = "http://localhost:4001";
  const projectId = new URLSearchParams(window.location.search).get("id");
  const user = JSON.parse(localStorage.getItem("user"));

  /* ================== ELEMENTS ================== */
  const title = document.getElementById("projectTitle");
  const desc = document.getElementById("projectDescription");
  const tagline = document.getElementById("projectTagline");
  const founderName = document.getElementById("founderName");
  const membersList = document.getElementById("membersList");
  const joinBtn = document.querySelector(".join-btn");

  let project = null;

  /* ================== UI HELPERS ================== */

  const createMemberCard = (member) => {
    const div = document.createElement("div");
    div.className = "member-card";
    div.innerHTML = `
      <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png">
      <h4>${member.nom} ${member.prenom}</h4>
    `;
    return div;
  };

  const setJoinButtonState = (state) => {
    const states = {
      owner: { text: "👑 Organizer", disabled: true },
      member: { text: "✅ Déjà membre", disabled: true },
      pending: { text: "⏳ Demande envoyée", disabled: true },
      join: { text: "🤝 Rejoindre le projet", disabled: false }
    };

    joinBtn.textContent = states[state].text;
    joinBtn.disabled = states[state].disabled;
  };

  /* ================== LOAD PROJECT ================== */

  async function loadProject() {
    try {
      const res = await fetch(`${API}/api/projects/getProject/${projectId}`);
      project = await res.json();

      renderProject();
      renderMembers();
      handleJoinButton();

    } catch (err) {
      title.textContent = "Erreur de chargement";
      console.error(err);
    }
  }

  /* ================== RENDER ================== */

  function renderProject() {
    title.textContent = project.title;
    desc.textContent = project.description;
    tagline.textContent = project.category || "";

    if (project.owner) {
      founderName.textContent =
        `${project.owner.nom} ${project.owner.prenom}`;
    }
  }

  function renderMembers() {
    membersList.innerHTML = "";
    project.members.forEach(m =>
      membersList.appendChild(createMemberCard(m))
    );
  }

  /* ================== JOIN LOGIC ================== */

  function handleJoinButton() {
    if (!user) return setJoinButtonState("join");

    if (user._id === project.owner?._id)
      return setJoinButtonState("owner");

    if (project.members.some(m => m._id === user._id))
      return setJoinButtonState("member");

    setJoinButtonState("join");
  }

  async function joinProject() {
    if (!user) {
      alert("Veuillez vous connecter");
      return location.href = "../login/login.html";
    }

    setJoinButtonState("pending");

    try {
      await fetch(`${API}/api/joinRequests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          userId: user._id
        })
      });

    } catch (err) {
      alert("Erreur lors de la demande");
      setJoinButtonState("join");
    }
  }

  /* ================== EVENTS ================== */

  if (joinBtn) joinBtn.addEventListener("click", joinProject);

  loadProject();
});
