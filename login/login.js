document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const togglePwd = document.getElementById("togglePwd");
  const pageWipe = document.getElementById("page-wipe");
  const toSignup = document.getElementById("toSignup");

  email.placeholder = " ";
  password.placeholder = " ";

  // 👁️ Toggle password visibility
  togglePwd.addEventListener("click", () => {
    const type = password.type === "password" ? "text" : "password";
    password.type = type;
    togglePwd.textContent = type === "text" ? "🙈" : "👁️";
  });

  // Email validation
  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function setError(input, msg) {
    const field = input.closest(".field");
    const err = field.querySelector(".error");
    err.textContent = msg;
    err.style.visibility = msg ? "visible" : "hidden";
    input.classList.toggle("invalid", !!msg);
  }

  function clearErrors() {
    document.querySelectorAll(".error").forEach(e => {
      e.textContent = "";
      e.style.visibility = "hidden";
    });
  }

  // Form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    let valid = true;

    if (!validateEmail(email.value.trim())) {
      setError(email, "Email invalide.");
      valid = false;
    }

    if (password.value.trim().length < 6) {
      setError(password, "Min. 6 caractères.");
      valid = false;
    }

    if (!valid) return;

    login();
  });

  // 🔐 REAL LOGIN WITH BACKEND
  async function login() {
    const btn = form.querySelector(".btn-primary");
    btn.disabled = true;
    btn.textContent = "Connexion...";

    try {
      const res = await fetch("http://localhost:4001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },  
        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(password, data.message || "Email ou mot de passe incorrect");
        btn.disabled = false;
        btn.textContent = "Connexion";
        return;
      }

      // ✅ Save authenticated user
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🎬 Keep your GSAP animation
      if (window.gsap) {
        gsap.timeline()
          .to("#page-wipe", {
            opacity: 1,
            scaleX: 1,
            duration: 0.45,
            ease: "power3.inOut"
          })
          .to("#page-wipe", {
            scaleX: 0,
            transformOrigin: "right",
            duration: 0.55,
            ease: "power3.inOut",
            delay: 0.1,
            onComplete: () => {
              window.location.href = "../home/home.html";
            }
          });
      }

    } catch (err) {
      console.error(err);
      setError(password, "Erreur serveur");
      btn.disabled = false;
      btn.textContent = "Connexion";
    }
  }

  // 👉 Go to signup with animation
  if (toSignup) {
    toSignup.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.gsap) {
        gsap.timeline()
          .to("#page-wipe", {
            opacity: 1,
            scaleX: 1,
            duration: 0.42,
            ease: "power3.inOut"
          })
          .to("#page-wipe", {
            scaleX: 0,
            transformOrigin: "right",
            duration: 0.45,
            delay: 0.12,
            onComplete: () => {
              window.location.href = toSignup.href;
            }
          });
      }
    });
  }

  // ✨ Entrance animations
  if (window.gsap) {
    gsap.from(".glass-card", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" });
    gsap.from(".left-panel .hero-copy h2", { opacity: 0, x: -20, duration: 0.9, delay: 0.1 });
    gsap.from(".features-list li", { opacity: 0, x: -8, stagger: 0.1, duration: 0.6, delay: 0.2 });
    gsap.from(".brand", { opacity: 0, y: -8, duration: 0.7 });
  }
});
