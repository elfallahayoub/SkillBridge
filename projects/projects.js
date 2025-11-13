document.addEventListener("DOMContentLoaded", () => {
  gsap.from(".project-card", {
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out"
  });

  gsap.from(".left-side", {
    duration: 1,
    x: -80,
    opacity: 0,
    ease: "power3.out"
  });
});
