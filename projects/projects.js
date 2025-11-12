document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  });

  // GSAP Animations
  if (window.gsap) {
    gsap.from(".project-card", { opacity: 0, y: 40, duration: 0.8, stagger: 0.2 });
  }

  // Join button click event
  const buttons = document.querySelectorAll(".join-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      gsap.to(btn, { scale: 1.1, backgroundColor: "#34d399", duration: 0.3 });
      setTimeout(() => {
        alert("🎉 Vous avez rejoint ce projet avec succès !");
      }, 200);
    });
  });
});
