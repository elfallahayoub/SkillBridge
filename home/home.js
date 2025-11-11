document.addEventListener("DOMContentLoaded", () => {
  // ===== NAVBAR PROFILE DROPDOWN =====
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.querySelector(".navbar-profile .profile-menu");
  
  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".navbar-profile")) {
        profileMenu.classList.add("hidden");
      }
    });

    // Close menu on item click
    document.querySelectorAll(".profile-menu .menu-item").forEach(item => {
      item.addEventListener("click", () => {
        profileMenu.classList.add("hidden");
      });
    });
  }

  // ===== PAGE NAVIGATION =====
  const navItems = document.querySelectorAll(".nav-item[data-page]");
  const mainContainer = document.querySelector(".main-container");
  const messengerPage = document.getElementById("messenger-page");
  const explorePage = document.getElementById("explore-page");
  
  function switchPage(page) {
    mainContainer.classList.add("hidden");
    messengerPage.classList.add("hidden");
    explorePage.classList.add("hidden");
    messengerPage.classList.remove("active");
    explorePage.classList.remove("active");
    
    navItems.forEach(btn => btn.classList.remove("active"));
    
    if (page === "feed") {
      mainContainer.classList.remove("hidden");
      document.querySelector('[data-page="feed"]').classList.add("active");
    } else if (page === "messenger") {
      messengerPage.classList.remove("hidden");
      messengerPage.classList.add("active");
      document.querySelector('[data-page="messenger"]').classList.add("active");
      renderConversations();
    } else if (page === "explore") {
      explorePage.classList.remove("hidden");
      explorePage.classList.add("active");
      document.querySelector('[data-page="explore"]').classList.add("active");
      renderExplore();
    }
  }

  navItems.forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.getAttribute("data-page");
      switchPage(page);
    });
  });

  // ===== DOM ELEMENTS =====
  const openComposer = document.querySelector(".composer-input");
  const composerModal = document.getElementById("composerModal");
  const closeComposer = document.getElementById("closeComposer");
  const projectForm = document.getElementById("projectForm");
  const postsFeed = document.getElementById("posts-feed");
  
  // Messenger
  const newConversationBtn = document.getElementById("newConversation");
  const conversationModal = document.getElementById("conversationModal");
  const closeConversationModal = document.getElementById("closeConversationModal");
  const conversationForm = document.getElementById("conversationForm");
  const conversationsList = document.getElementById("conversations-list");
  const searchConversation = document.getElementById("searchConversation");
  const chatArea = document.getElementById("chat-area");
  const chatTitle = document.getElementById("chatTitle");
  const messagesContainer = document.getElementById("messages-container");
  const messageInput = document.getElementById("messageInput");
  const sendMessage = document.getElementById("sendMessage");
  const closeChat = document.getElementById("closeChat");
  const noChatSelected = document.getElementById("no-chat-selected");
  
  // Explorer
  const exploreGrid = document.getElementById("explore-grid");
  const categoryFilter = document.getElementById("categoryFilter");
  
  // Other
  const logout = document.getElementById("logout");
  const search = document.getElementById("search");

  // ===== DATA =====
  let projects = JSON.parse(localStorage.getItem("projects")) || [];
  let conversations = JSON.parse(localStorage.getItem("conversations")) || [];
  let currentUser = JSON.parse(localStorage.getItem("user")) || { name: "Anonyme", id: "user_" + Date.now() };
  let currentConversationId = null;

  // Update profile name in navbar
  const profileNameEl = document.getElementById("profileName");
  if (profileNameEl) {
    profileNameEl.textContent = currentUser.name;
  }

  // ===== FEED SECTION =====
  function renderPosts() {
    postsFeed.innerHTML = "";
    if (projects.length === 0) {
      postsFeed.innerHTML = '<p class="empty-state">Aucun projet. Sois le premier à en créer! 🚀</p>';
      return;
    }
    
    projects.forEach(project => {
      const postCard = document.createElement("div");
      postCard.className = "post-card";
      const timeAgo = getTimeAgo(new Date(project.createdAt));
      
      postCard.innerHTML = `
        <div class="post-header">
          <div class="post-author-info">
            <div class="post-avatar">👤</div>
            <div class="post-author-details">
              <div class="post-author-name">${project.author}</div>
              <div class="post-time">${timeAgo}</div>
            </div>
          </div>
          <button class="post-options">⋯</button>
        </div>
        <span class="post-category">${project.category || 'General'}</span>
        <h3 class="post-title">${project.title}</h3>
        <p class="post-description">${project.description}</p>
        <div class="post-skills">
          ${project.skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
        </div>
        <div class="post-footer">
          <button class="post-action-btn">👍 J'aime</button>
          <button class="post-action-btn">💬 Commenter</button>
          <button class="post-action-btn">� Partager</button>
        </div>
      `;
      postsFeed.appendChild(postCard);
    });
    
    gsap.from(".post-card", { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 });
  }

  function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "À l'instant";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h";
    return Math.floor(seconds / 86400) + "j";
  }

  renderPosts();

  // Composer
  openComposer.addEventListener("click", () => {
    composerModal.classList.remove("hidden");
  });

  closeComposer.addEventListener("click", () => {
    composerModal.classList.add("hidden");
  });

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProject = {
      id: "project_" + Date.now(),
      title: projectForm.title.value.trim(),
      description: projectForm.description.value.trim(),
      category: projectForm.category.value,
      skills: projectForm.skills.value.trim(),
      author: currentUser.name,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    projects.unshift(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));
    composerModal.classList.add("hidden");
    projectForm.reset();
    renderPosts();
  });

  // Search
  search.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = projects.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.skills.toLowerCase().includes(term)
    );
    
    if (filtered.length === 0) {
      postsFeed.innerHTML = '<p class="empty-state">Aucun résultat trouvé...</p>';
      return;
    }
    
    postsFeed.innerHTML = "";
    filtered.forEach(project => {
      const postCard = document.createElement("div");
      postCard.className = "post-card";
      const timeAgo = getTimeAgo(new Date(project.createdAt));
      
      postCard.innerHTML = `
        <div class="post-header">
          <div class="post-author-info">
            <div class="post-avatar">👤</div>
            <div class="post-author-details">
              <div class="post-author-name">${project.author}</div>
              <div class="post-time">${timeAgo}</div>
            </div>
          </div>
          <button class="post-options">⋯</button>
        </div>
        <span class="post-category">${project.category || 'General'}</span>
        <h3 class="post-title">${project.title}</h3>
        <p class="post-description">${project.description}</p>
        <div class="post-skills">
          ${project.skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
        </div>
        <div class="post-footer">
          <button class="post-action-btn">👍 J'aime</button>
          <button class="post-action-btn">💬 Commenter</button>
          <button class="post-action-btn">📤 Partager</button>
        </div>
      `;
      postsFeed.appendChild(postCard);
    });
  });

  // ===== MESSENGER SECTION =====
  function renderConversations(list = conversations) {
    conversationsList.innerHTML = "";
    if (list.length === 0) {
      conversationsList.innerHTML = '<p class="empty-state">Aucune conversation</p>';
      return;
    }
    
    list.forEach(conv => {
      const item = document.createElement("div");
      item.className = "conversation-item" + (conv.id === currentConversationId ? " active" : "");
      const lastMsg = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].text.substring(0, 30) + "..." : "Pas de messages";
      
      item.innerHTML = `
        <div class="conversation-name">${conv.name}</div>
        <div class="conversation-preview">${lastMsg}</div>
      `;
      item.addEventListener("click", () => openConversation(conv.id));
      conversationsList.appendChild(item);
    });
  }

  function openConversation(convId) {
    currentConversationId = convId;
    const conv = conversations.find(c => c.id === convId);
    
    if (conv) {
      chatTitle.textContent = conv.name;
      noChatSelected.classList.add("hidden");
      chatArea.classList.remove("hidden");
      renderMessages(conv.messages);
      messageInput.focus();
    }
    renderConversations();
  }

  function renderMessages(messages) {
    messagesContainer.innerHTML = "";
    messages.forEach(msg => {
      const msgEl = document.createElement("div");
      msgEl.className = "message" + (msg.userId === currentUser.id ? " own" : " other");
      const time = new Date(msg.timestamp).toLocaleTimeString();
      
      msgEl.innerHTML = `
        <div>
          <div class="message-bubble">${escapeHtml(msg.text)}</div>
          <div class="message-meta">${msg.author} • ${time}</div>
        </div>
      `;
      messagesContainer.appendChild(msgEl);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function sendMessageHandler() {
    const text = messageInput.value.trim();
    if (!text || !currentConversationId) return;

    const conv = conversations.find(c => c.id === currentConversationId);
    if (conv) {
      conv.messages.push({
        id: "msg_" + Date.now(),
        text: text,
        author: currentUser.name,
        userId: currentUser.id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("conversations", JSON.stringify(conversations));
      messageInput.value = "";
      renderMessages(conv.messages);
    }
  }

  sendMessage.addEventListener("click", sendMessageHandler);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  });

  closeChat.addEventListener("click", () => {
    currentConversationId = null;
    noChatSelected.classList.remove("hidden");
    chatArea.classList.add("hidden");
    renderConversations();
  });

  newConversationBtn.addEventListener("click", () => {
    conversationModal.classList.remove("hidden");
  });

  closeConversationModal.addEventListener("click", () => {
    conversationModal.classList.add("hidden");
  });

  conversationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newConv = {
      id: "conv_" + Date.now(),
      name: conversationForm.conversationName.value.trim(),
      participants: conversationForm.participantsList.value.split(',').map(p => p.trim()),
      messages: [],
      createdAt: new Date().toISOString()
    };
    conversations.push(newConv);
    localStorage.setItem("conversations", JSON.stringify(conversations));
    conversationModal.classList.add("hidden");
    conversationForm.reset();
    renderConversations();
  });

  searchConversation.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = conversations.filter(c => c.name.toLowerCase().includes(term));
    renderConversations(filtered);
  });

  renderConversations();

  // ===== EXPLORER SECTION =====
  function renderExplore() {
    exploreGrid.innerHTML = "";
    const categories = [
      { cat: "web", name: "Web Development", count: 245 },
      { cat: "mobile", name: "Mobile Apps", count: 189 },
      { cat: "ai", name: "AI & Machine Learning", count: 156 },
      { cat: "data", name: "Data Science", count: 143 },
      { cat: "design", name: "UI/UX Design", count: 128 }
    ];
    
    categories.forEach(cat => {
      const card = document.createElement("div");
      card.className = "post-card";
      const count = projects.filter(p => p.category === cat.cat).length || cat.count;
      
      card.innerHTML = `
        <h3 class="post-title">${cat.name}</h3>
        <p class="post-description">${count} projets actifs dans cette catégorie</p>
        <div class="post-footer">
          <button class="post-action-btn">Voir tous →</button>
        </div>
      `;
      exploreGrid.appendChild(card);
    });
  }

  categoryFilter.addEventListener("change", (e) => {
    const category = e.target.value;
    postsFeed.innerHTML = "";
    const filtered = category ? projects.filter(p => p.category === category) : projects;
    
    if (filtered.length === 0) {
      postsFeed.innerHTML = '<p class="empty-state">Aucun projet dans cette catégorie</p>';
      return;
    }
    
    filtered.forEach(project => {
      const postCard = document.createElement("div");
      postCard.className = "post-card";
      const timeAgo = getTimeAgo(new Date(project.createdAt));
      
      postCard.innerHTML = `
        <div class="post-header">
          <div class="post-author-info">
            <div class="post-avatar">👤</div>
            <div class="post-author-details">
              <div class="post-author-name">${project.author}</div>
              <div class="post-time">${timeAgo}</div>
            </div>
          </div>
          <button class="post-options">⋯</button>
        </div>
        <span class="post-category">${project.category || 'General'}</span>
        <h3 class="post-title">${project.title}</h3>
        <p class="post-description">${project.description}</p>
        <div class="post-skills">
          ${project.skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
        </div>
        <div class="post-footer">
          <button class="post-action-btn">👍 J'aime</button>
          <button class="post-action-btn">💬 Commenter</button>
          <button class="post-action-btn">📤 Partager</button>
        </div>
      `;
      postsFeed.appendChild(postCard);
    });
  });

  // ===== LOGOUT =====
  logout.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "../login/login.html";
  });

  // ===== ANIMATIONS =====
  gsap.from(".navbar", { y: -40, opacity: 0, duration: 0.6, ease: "power3.out" });
  gsap.from(".sidebar-left", { x: -30, opacity: 0, duration: 0.6, ease: "power3.out" });
  gsap.from(".feed-container", { opacity: 0, duration: 0.6, ease: "power3.out" });
  gsap.from(".sidebar-right", { x: 30, opacity: 0, duration: 0.6, ease: "power3.out" });
});
