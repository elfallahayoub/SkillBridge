document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  // 🔹 Inputs
  const modifyForm = document.getElementById("modifyForm");
  const nom = document.getElementById("nom");
  const prenom = document.getElementById("prenom");
  const email = document.getElementById("email");
  const numeroTele = document.getElementById("numeroTele");
  const specialite = document.getElementById("specialite");
  const niveau = document.getElementById("niveau");

  // 🔹 Photo
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");

  // 🔹 Pré-remplissage
  nom.value = user.nom || "";
  prenom.value = user.prenom || "";
  email.value = user.email || "";
  email.disabled = true; // sécurité
  numeroTele.value = user.numeroTele || "";
  specialite.value = user.specialite || "";
  niveau.value = user.niveau || "";
  photoPreview.src = user.photo || photoPreview.src;

  // 🔹 Preview photo
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image trop grande (max 2MB)");
      photoInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      photoPreview.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  // 🔹 Submit
  modifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedUser = {
      nom: nom.value,
      prenom: prenom.value,
      numeroTele: numeroTele.value,
      specialite: specialite.value,
      niveau: niveau.value,
      photo: photoPreview.src
    };

    try {
      const res = await fetch(
        `http://localhost:4001/api/users/updateUser/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur de mise à jour");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Profil mis à jour !");
      window.location.href = "../profile/profile.html";

    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  });
});
