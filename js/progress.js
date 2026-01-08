function validateModule(id) {
  localStorage.setItem(id, "validé");
  document.getElementById(id).textContent = "✅ Validé";
  updateProgress();
}

function updateProgress() {
  let modules = ["m1", "m2"];
  let done = modules.filter(m => localStorage.getItem(m) === "validé").length;
  document.getElementById("globalProgress").textContent =
    `Progression : ${done}/${modules.length} modules validés`;
}

updateProgress();
