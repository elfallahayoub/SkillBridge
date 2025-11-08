document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const nom = document.getElementById("nom");
  const password = document.getElementById("password");
  const togglePwd = document.getElementById("togglePwd");
  const pageWipe = document.getElementById("page-wipe");
  const toSignup = document.getElementById("toSignup");

  // placeholders for floating labels
  [email, nom, password].forEach(i => i.placeholder = " ");

  // 👁️ Toggle password visibility
  togglePwd?.addEventListener("click", () => {
    const t = password.type === "password" ? "text" : "password";
    password.type = t;
    togglePwd.textContent = t === "text" ? "🙈" : "👁️";
  });

  // ✉️ Validate email format
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // ⚠️ Show or clear field errors
  function setError(input, msg) {
    const field = input.closest(".field");
    const err = field.querySelector(".error");
    err.textContent = msg;
    err.style.visibility = msg ? "visible" : "hidden";
    input.classList.toggle("invalid", !!msg);
  }

  // 🚀 Submit handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    // validate nom
    if (nom.value.trim().length < 2) {
      setError(nom, "Nom trop court.");
      ok = false;
    } else setError(nom, "");

    // validate email
    if (!validateEmail(email.value.trim())) {
      setError(email, "Email invalide.");
      ok = false;
    } else setError(email, "");

    // validate password
    if (password.value.trim().length < 6) {
      setError(password, "Min. 6 caractères.");
      ok = false;
    } else setError(password, "");

    if (!ok) return;
    simulateSignup();
  });

  // ✨ Simulate signup + GSAP page wipe
  function simulateSignup() {
    const btn = form.querySelector(".btn-primary");
    btn.disabled = true;
    btn.style.opacity = 0.95;

    if (window.gsap) {
      gsap.timeline()
        .to("#page-wipe", { opacity: 1, scaleX: 1, duration: 0.45, ease: "power3.inOut" })
        .to("#page-wipe", {
          scaleX: 0,
          transformOrigin: "right",
          duration: 0.55,
          ease: "power3.inOut",
          delay: 0.1,
          onComplete: () => {
            btn.textContent = "Compte créé ✓";
            setTimeout(() => { btn.disabled = false; btn.textContent = "Créer le compte"; }, 800);
          }
        });
    }
  }

  // 🔁 Optional link transition (back to login)
  if (toSignup) {
    toSignup.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.gsap) {
        gsap.timeline()
          .to("#page-wipe", { opacity: 1, scaleX: 1, duration: 0.42, ease: "power3.inOut" })
          .to("#page-wipe", {
            scaleX: 0,
            transformOrigin: "right",
            duration: 0.45,
            delay: 0.12,
            onComplete: () => window.location.href = toSignup.href
          });
      }
    });
  }


  if (window.gsap) {
    gsap.from(".glass-card", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" });
    gsap.from(".brand", { opacity: 0, y: -8, duration: 0.7 });
  }
});
