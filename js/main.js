async function loadPartial(container) {
  const file = container.dataset.partial;

  if (!file) {
    return;
  }

  const response = await fetch(file);

  if (!response.ok) {
    throw new Error(`Partial konnte nicht geladen werden: ${file}`);
  }

  container.innerHTML = await response.text();
}

function markCurrentNavigationLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".main-nav a[href], .site-footer a[href]");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function initMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("main-navigation");

  if (!menuToggle || !navigation) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navigation.classList.toggle("is-open", !isExpanded);
  });
}

async function initLayoutPartials() {
  const partialContainers = document.querySelectorAll("[data-partial]");

  await Promise.all(Array.from(partialContainers, loadPartial));
  markCurrentNavigationLink();
  initMenuToggle();
}

document.addEventListener("DOMContentLoaded", () => {
  initLayoutPartials().catch((error) => {
    console.error(error);
  });
});
