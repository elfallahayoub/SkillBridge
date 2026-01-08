function goToModify() {
   window.location.href = "../modify/modify.html";
}
function createProject() {
  window.location.href = "../create_project/create-project.html";
  

}
document.addEventListener("DOMContentLoaded", () => {
// Déclarez-la comme une fonction globale (pas à l'intérieur d'un autre bloc)




  const user = JSON.parse(localStorage.getItem("user")); 

  // If not logged in → redirect
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }



  // Inject user data into profile
  document.getElementById("username").textContent =
    `${user.prenom} ${user.nom}`;

  document.getElementById("email").textContent =
    user.email;

  document.getElementById("fullname").textContent =
    `${user.nom} ${user.prenom}`;

  document.getElementById("university").textContent =
    user.university || "ESISA";

  document.getElementById("numEtudiant").textContent =
    user.numeroEtudiant || "*****";

  document.getElementById("level").textContent =
    user.niveau || "level";

  document.getElementById("specialite").textContent = 
    user.specialite || "vide";
  
  const profilePic = document.querySelector(".profile-pic");

  profilePic.src = user.photo
    ? "http://localhost:4001" + user.photo
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";




  const elements = document.querySelectorAll(".fade-in");

  const showOnScroll = () => {
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", showOnScroll);
  showOnScroll();


/* 
  window.editProfile = () => {
    alert("Fonctionnalité à venir : modification du profil !");
  }; */

  window.openProject = () => {
    window.location.href = "../project-details/project-details.html";
  };

});
