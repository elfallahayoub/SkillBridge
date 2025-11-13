document.addEventListener("DOMContentLoaded", () => {
  if (window.gsap) {
    gsap.from(".hero-content", { opacity: 0, y: 40, duration: 1 });
    gsap.from(".card", { opacity: 0, y: 20, duration: 0.8, stagger: 0.2 });
  }

  const exploreBtn = document.querySelector(".cta-btn");
  exploreBtn.addEventListener("click", () => {
    window.location.href = "/projects/projects.html";
  });
});
