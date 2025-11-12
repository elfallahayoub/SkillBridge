document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  });

  // GSAP Animations
  if (window.gsap) {
    gsap.from(".hero-content", { opacity: 0, y: 40, duration: 1 });
    gsap.from(".card", { opacity: 0, y: 20, duration: 0.8, stagger: 0.2 });
  }

  // Chat toggle
  const chatToggle = document.querySelector(".chat-toggle");
  const chatBox = document.querySelector(".chat-box");
  chatToggle.addEventListener("click", () => {
    const visible = chatBox.style.display === "block";
    if (!visible) {
      chatBox.style.display = "block";
      gsap.fromTo(chatBox, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
    } else {
      gsap.to(chatBox, {
        opacity: 0, y: 20, duration: 0.3,
        onComplete: () => chatBox.style.display = "none"
      });
    }
  });
});
