const defaultSettings = {
  fontSize: 16,
  theme: "light",
  contrast: "normal",
  motion: "full",
};

const settingsStorageKey = "portfolio-settings";

function loadSettings() {
  try {
    return {
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem(settingsStorageKey)),
    };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
  } catch {
    // Einstellungen bleiben auch ohne lokalen Speicher für die aktuelle Sitzung aktiv.
  }
}

function applySettings(settings) {
  document.documentElement.style.fontSize = `${settings.fontSize}px`;
  document.body.dataset.theme = settings.theme;
  document.body.dataset.contrast = settings.contrast;
  document.body.dataset.motion = settings.motion;
}

function updateSettingsControls(settings) {
  const fontSizeValue = document.querySelector('[data-setting="font-size-value"]');
  const themeButton = document.querySelector('[data-setting="theme"]');
  const contrastButton = document.querySelector('[data-setting="contrast"]');
  const motionButton = document.querySelector('[data-setting="motion"]');

  if (fontSizeValue) {
    fontSizeValue.textContent = `${settings.fontSize}px`;
  }

  [
    [themeButton, settings.theme === "dark"],
    [contrastButton, settings.contrast === "high"],
    [motionButton, settings.motion === "reduced"],
  ].forEach(([button, isActive]) => {
    if (!button) {
      return;
    }

    button.setAttribute("aria-pressed", String(isActive));
    button.textContent = isActive ? "Aktiviert" : "Deaktiviert";
  });
}

function initSettingsControls() {
  const settings = loadSettings();
  const fontDecrease = document.querySelector('[data-setting="font-decrease"]');
  const fontIncrease = document.querySelector('[data-setting="font-increase"]');
  const fontReset = document.querySelector('[data-setting="font-reset"]');
  const themeButton = document.querySelector('[data-setting="theme"]');
  const contrastButton = document.querySelector('[data-setting="contrast"]');
  const motionButton = document.querySelector('[data-setting="motion"]');

  const updateSettings = (changes) => {
    Object.assign(settings, changes);
    applySettings(settings);
    updateSettingsControls(settings);
    saveSettings(settings);
  };

  fontDecrease?.addEventListener("click", () => {
    updateSettings({ fontSize: Math.max(14, settings.fontSize - 1) });
  });

  fontIncrease?.addEventListener("click", () => {
    updateSettings({ fontSize: Math.min(20, settings.fontSize + 1) });
  });

  fontReset?.addEventListener("click", () => {
    updateSettings({ fontSize: defaultSettings.fontSize });
  });

  themeButton?.addEventListener("click", () => {
    updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
  });

  contrastButton?.addEventListener("click", () => {
    updateSettings({ contrast: settings.contrast === "high" ? "normal" : "high" });
  });

  motionButton?.addEventListener("click", () => {
    updateSettings({ motion: settings.motion === "reduced" ? "full" : "reduced" });
  });

  updateSettingsControls(settings);
}

applySettings(loadSettings());

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

  const setMenuState = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Navigation schließen" : "Navigation öffnen");
    navigation.classList.toggle("is-open", isOpen);
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isExpanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
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

function initBackButtons() {
  const backButtons = document.querySelectorAll(".back-button");

  backButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "index.html";
      }
    });
  });
}

async function initLayoutPartials() {
  const partialContainers = document.querySelectorAll("[data-partial]");

  await Promise.all(Array.from(partialContainers, loadPartial));
  markCurrentNavigationLink();
  initSettingsControls();
  initMenuToggle();
}

initLayoutPartials().catch((error) => {
  console.error(error);
});

initVideoDialogs();
initShareLinks();
initBackButtons();
