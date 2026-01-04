document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  const modifyForm = document.getElementById("modifyForm");
  const nom = document.getElementById("nom");
  const prenom = document.getElementById("prenom");
  const email = document.getElementById("email");
  const numeroTele = document.getElementById("numeroTele");
  const specialite = document.getElementById("specialite");
  const niveau = document.getElementById("niveau");

  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");

  // Pré-remplissage
  nom.value = user.nom || "";
  prenom.value = user.prenom || "";
  email.value = user.email || "";
  email.disabled = true;
  numeroTele.value = user.numeroTele || "";
  specialite.value = user.specialite || "";
  niveau.value = user.niveau || "";
  if (user.photo) photoPreview.src = user.photo? `http://localhost:4001${user.photo}`: photoPreview.src;

  // Preview image
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

  // Submit avec FormData
  modifyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("nom", nom.value);
  formData.append("prenom", prenom.value);
  formData.append("numeroTele", numeroTele.value);
  formData.append("specialite", specialite.value);
  formData.append("niveau", niveau.value);

  if (photoInput.files[0]) {
    formData.append("photo", photoInput.files[0]);
  }

  const res = await fetch(
    `http://localhost:4001/api/users/updateUser/${user._id}`,
    {
      method: "PUT",
      body: formData 
    }
  );

  const data = await res.json();

  localStorage.setItem("user", JSON.stringify(data.user));
  window.location.href = "../profil/profile.html";
});

});
