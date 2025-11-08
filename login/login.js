// login.js - interactions, validation, GSAP entrance + reveal wipe integration
document.addEventListener("DOMContentLoaded", () => {

  // Elements
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const togglePwd = document.getElementById("togglePwd");
  const pageWipe = document.getElementById("page-wipe");
  const toSignup = document.getElementById("toSignup");

  // Pre-fill placeholders trick for floating labels (so :not(:placeholder-shown) works)
  email.placeholder = " ";
  password.placeholder = " ";

  // Toggle password visibility
  togglePwd.addEventListener("click", () => {
    const t = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", t);
    togglePwd.textContent = t === "text" ? "🙈" : "👁️";
  });

  // Basic email validation
  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  // Show error helper
  function setError(input, msg) {
    const field = input.closest(".field");
    const err = field.querySelector(".error");
    err.textContent = msg;
    err.style.visibility = msg ? "visible" : "hidden";
    if(msg) input.classList.add("invalid"); else input.classList.remove("invalid");
  }

  // Form submit (fake auth for prototype)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    if(!validateEmail(email.value.trim())) {
      setError(email, "Email invalide.");
      ok = false;
    } else setError(email, "");

    if(password.value.trim().length < 6) {
      setError(password, "Le mot de passe doit contenir au moins 6 caractères.");
      ok = false;
    } else setError(password, "");

    if(!ok) return;

    // Simulate loading + success with page wipe then redirect (prototype)
    simulateLogin();
  });

  // Simulate login with GSAP wipe
  function simulateLogin(){
    // small "button pop" effect
    const btn = form.querySelector(".btn-primary");
    btn.disabled = true;
    btn.style.opacity = 0.95;

    // If GSAP available, animate wipe
    if(window.gsap){
      gsap.timeline()
        .to("#page-wipe",{opacity:1,scaleX:1,duration:0.45,ease:"power3.inOut"})
        .to("#page-wipe",{opacity:1,duration:0.18})
        .to("#page-wipe",{scaleX:0,transformOrigin:"right",duration:0.55,ease:"power3.inOut",delay:0.08, onComplete:() => {
          // After wipe complete: show success message
          btn.textContent = "Connecté ✓";
          setTimeout(() => { btn.disabled = false; btn.textContent = "Connexion"; }, 700);
        }});
    } else {
      // fallback
      pageWipe.style.opacity = "1";
      pageWipe.style.transform = "scaleX(1)";
      setTimeout(() => {
        pageWipe.style.transform = "scaleX(0)";
        btn.textContent = "Connecté ✓";
        setTimeout(()=>{ btn.textContent = "Connexion"; btn.disabled=false },700);
      },800);
    }
  }

  // If user clicks signup link — show reveal then navigate (prototype)
  if(toSignup){
    toSignup.addEventListener("click", (e) => {
      e.preventDefault();
      // animate wipe then change location (relative path)
      if(window.gsap){
        gsap.timeline()
          .to("#page-wipe",{opacity:1,scaleX:1,duration:0.42,ease:"power3.inOut"})
          .to("#page-wipe",{scaleX:0,transformOrigin:"right",duration:0.45,delay:0.12, onComplete:() => {
            window.location.href = toSignup.getAttribute("href");
          }});
      } else {
        pageWipe.style.opacity = 1; pageWipe.style.transform = "scaleX(1)";
        setTimeout(()=>{ pageWipe.style.transform = "scaleX(0)"; window.location.href = toSignup.getAttribute("href"); },600);
      }
    });
  }

  // keyboard focus outlines for accessibility
  document.addEventListener("keydown", (e) => { if(e.key === "Tab") document.body.classList.add("show-focus"); });

  // GSAP entrance animations
  if(window.gsap){
    gsap.from(".glass-card",{opacity:0,y:18,duration:0.8,ease:"power3.out"});
    gsap.from(".left-panel .hero-copy h2",{opacity:0,x:-16,duration:0.9,delay:0.12});
    gsap.from(".features-list li",{opacity:0,x:-8,stagger:0.08,duration:0.6,delay:0.18});
    gsap.from(".brand",{opacity:0,y:-8,duration:0.7});
  }

});
