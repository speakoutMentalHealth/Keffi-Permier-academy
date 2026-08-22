
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  // Active nav item
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === page) a.classList.add("active");
  });

  // Demo contact/admission forms
  document.querySelectorAll("[data-demo-form]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const target = form.querySelector("[data-form-message]");
      if (target) {
        target.textContent = "Thank you. This demo form is ready to be connected to your preferred backend or form service.";
        target.style.color = "#137a56";
      }
      form.reset();
    });
  });
});
