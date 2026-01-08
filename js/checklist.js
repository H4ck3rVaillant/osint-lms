const boxes = document.querySelectorAll("input[type=checkbox]");
const progress = document.getElementById("progress");

boxes.forEach(box => {
  box.addEventListener("change", () => {
    const done = [...boxes].filter(b => b.checked).length;
    progress.textContent = `Progression : ${done}/${boxes.length}`;
  });
});
