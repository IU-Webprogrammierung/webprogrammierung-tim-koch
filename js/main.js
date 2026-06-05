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

// Videocontainer öffnen
function initVideoDialogs() {
  const videoButtons = document.querySelectorAll(".video-card-button[aria-controls]");

  videoButtons.forEach((button) => {
    const dialogId = button.getAttribute("aria-controls");
    const dialog = document.getElementById(dialogId);

    if (!dialog || typeof dialog.showModal !== "function") {
      return;
    }

    button.addEventListener("click", () => {
      dialog.showModal();

      requestAnimationFrame(() => {
        dialog.querySelectorAll("iframe[data-src]").forEach((iframe) => {
          iframe.src = iframe.dataset.src;
        });
      });
    });

    dialog.addEventListener("close", () => {
      dialog.querySelectorAll("video").forEach((video) => {
        video.pause();
      });

      dialog.querySelectorAll("iframe[data-src]").forEach((iframe) => {
        iframe.removeAttribute("src");
      });
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });
}

function initShareLinks() {
  const shareLinks = document.querySelectorAll(".video-share-link");

  shareLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      const shareUrl = new URL(link.getAttribute("href"), window.location.href).href;
      const shareTitle = link.closest(".video-dialog")?.querySelector("h2")?.textContent || document.title;

      if (navigator.share) {
        event.preventDefault();
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        return;
      }

      if (navigator.clipboard) {
        event.preventDefault();
        await navigator.clipboard.writeText(shareUrl);
      }
    });
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

  initVideoDialogs();
  initShareLinks();
});
