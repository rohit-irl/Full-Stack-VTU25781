const form = document.getElementById("form");
const success = document.getElementById("success");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  success.classList.add("active");

  setTimeout(() => {
    success.classList.remove("active");
    form.reset();
  }, 3000);
});
