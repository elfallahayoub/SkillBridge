document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const togglePwd = document.getElementById("togglePwd");
  const pageWipe = document.getElementById("page-wipe");
  const toSignup = document.getElementById("toSignup");

  email.placeholder = " ";
  password.placeholder = " ";

  togglePwd.addEventListener("click", () => {
    const t = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", t);
    togglePwd.textContent = t === "text" ? "🙈" : "👁️";
  });

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function setError(input, msg) {
    const field = input.closest(".field");
    const err = field.querySelector(".error");
    err.textContent = msg;
    err.style.visibility = msg ? "visible" : "hidden";
    if (msg) input.classList.add("invalid");
    else input.classList.remove("invalid");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    if (!validateEmail(email.value.trim())) {
      setError(email, "Email invalide.");
      ok = false;
    } else setError(email, "");

    if (password.value.trim().length < 6) {
      setError(password, "Min. 6 caractères.");
      ok = false;
    } else setError(password, "");

    if (!ok) return;
    simulateLogin();
  });

  function simulateLogin() {
    const btn = form.querySelector(".btn-primary");
    btn.disabled = true;
    btn.style.opacity = 0.95;

    if (window.gsap) {
      gsap.timeline()
        .to("#page-wipe", { opacity: 1, scaleX: 1, duration: 0.45, ease: "power3.inOut" })
        .to("#page-wipe", { opacity: 1, duration: 0.18 })
        .to("#page-wipe", {
          scaleX: 0, transformOrigin: "right", duration: 0.55, ease: "power3.inOut", delay: 0.08, 
          onComplete: () => {
            btn.textContent = "Connecté ✓";
            setTimeout(() => { btn.disabled = false; btn.textContent = "Connexion"; }, 700);
          }
        });
    }
  }

  if (toSignup) {
    toSignup.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.gsap) {
        gsap.timeline()
          .to("#page-wipe", { opacity: 1, scaleX: 1, duration: 0.42, ease: "power3.inOut" })
          .to("#page-wipe", {
            scaleX: 0, transformOrigin: "right", duration: 0.45, delay: 0.12, 
            onComplete: () => window.location.href = toSignup.getAttribute("href")
          });
      }
    });
  }

  // Animations GSAP à l’ouverture
  if (window.gsap) {
    gsap.from(".glass-card", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" });
    gsap.from(".left-panel .hero-copy h2", { opacity: 0, x: -20, duration: 0.9, delay: 0.12 });
    gsap.from(".features-list li", { opacity: 0, x: -8, stagger: 0.08, duration: 0.6, delay: 0.18 });
    gsap.from(".brand", { opacity: 0, y: -8, duration: 0.7 });
  }
});
