document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const buttons = document.querySelectorAll(".join-btn");

  // Menu burger mobile
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Redirection vers page détail projet
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = "/projet_details/project-details.html";
    });
  });
});
