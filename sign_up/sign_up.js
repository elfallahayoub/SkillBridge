alert("SIGN UP JS LOADED");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const email = document.getElementById("email");
  const nom = document.getElementById("nom");
  const password = document.getElementById("password");
  const togglePwd = document.getElementById("togglePwd");
  const toSignup = document.getElementById("toSignup");

  // floating label placeholders
  [email, nom, password].forEach(i => i.placeholder = " ");

  // 👁️ Toggle password visibility
  togglePwd?.addEventListener("click", () => {
    const type = password.type === "password" ? "text" : "password";
    password.type = type;
    togglePwd.textContent = type === "text" ? "🙈" : "👁️";
  });

  // ✉️ Email validation
  const validateEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // ⚠️ Error handler
  function setError(input, msg) {
    const field = input.closest(".field");
    const err = field.querySelector(".error");
    err.textContent = msg;
    err.style.visibility = msg ? "visible" : "hidden";
    input.classList.toggle("invalid", !!msg);
  }

  // 🚀 Submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let ok = true;

    // nom
    if (nom.value.trim().length < 2) {
      setError(nom, "Nom trop court.");
      ok = false;
    } else setError(nom, "");

    // email
    if (!validateEmail(email.value.trim())) {
      setError(email, "Email invalide.");
      ok = false;
    } else setError(email, "");

    // password
    if (password.value.trim().length < 6) {
      setError(password, "Min. 6 caractères.");
      ok = false;
    } else setError(password, "");

    if (!ok) return;

    await realSignup();
  });

  // 🌐 REAL SIGNUP (Backend)
  async function realSignup() {
    const btn = form.querySelector(".btn-primary");
    btn.disabled = true;
    btn.style.opacity = 0.95;

    try {
      const user = {
        nom: nom.value.trim(),
        prenom: "temp",                // required by backend
        numeroEtudiant: numeroEtudiant.value.trim(),     // required by backend
        email: email.value.trim(),
        password: password.value.trim(),
        numeroTele: "0600000000"       // required by backend
      };

      const res = await fetch("http://localhost:4001/api/users/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(email, data.message || "Erreur lors de l'inscription");
        btn.disabled = false;
        btn.style.opacity = 1;
        return;
      }

      // ✅ Success animation
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
              btn.textContent = "Compte créé ✓";
              setTimeout(() => {
                window.location.href = "../login/login.html";
              }, 700);
            }
          });
      }

    } catch (err) {
      console.error(err);
      setError(email, "Erreur serveur");
      btn.disabled = false;
      btn.style.opacity = 1;
    }
  }

  // 🔁 Transition to login
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

  // ✨ Page entrance animations
  if (window.gsap) {
    gsap.from(".glass-card", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out"
    });
    gsap.from(".brand", {
      opacity: 0,
      y: -8,
      duration: 0.7
    });
  }
});
