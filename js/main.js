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

function createElement(tagName, attributes = {}, textContent = "") {
  const element = document.createElement(tagName);

  Object.entries(attributes).forEach(([name, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    element.setAttribute(name, value);
  });

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

function createCertificateCard(certificate) {
  const item = createElement("li");
  const button = createElement("button", {
    class: "certificate-badge-link",
    type: "button",
    "aria-haspopup": "dialog",
    "aria-controls": `certificate-dialog-${certificate.id}`,
    "aria-label": `${certificate.provider}-Zertifikat ${certificate.title} anzeigen`,
  });
  const badge = createElement("img", {
    src: certificate.badge,
    alt: certificate.badgeAlt,
  });

  button.append(badge);

  if (certificate.shortTitle) {
    button.append(createElement("span", { class: "certificate-title" }, certificate.shortTitle));
  }

  item.append(button);
  return item;
}

function createCertificateDialog(certificate) {
  const dialog = createElement("dialog", {
    class: "certificate-dialog",
    id: `certificate-dialog-${certificate.id}`,
    "aria-labelledby": `certificate-dialog-${certificate.id}-title`,
  });
  const form = createElement("form", { method: "dialog" });
  const closeButton = createElement("button", {
    type: "submit",
    "aria-label": "Zertifikat schließen",
  });
  const closeIcon = createElement("span", {
    class: "icon icon-close-light",
    "aria-hidden": "true",
  });
  const content = createElement("div", { class: "certificate-dialog-content" });
  const title = createElement("h2", { id: `certificate-dialog-${certificate.id}-title` }, certificate.shortTitle || certificate.title);
  const description = createElement("p", {}, certificate.description);
  const preview = createElement("figure", { class: "certificate-preview" });
  const previewImage = createElement("img", {
    src: certificate.preview || certificate.badge,
    alt: certificate.previewAlt || `Vorschau des Zertifikats ${certificate.title}`,
    loading: "lazy",
  });
  const actions = createElement("div", { class: "certificate-dialog-actions" });
  const pdfLink = createElement("a", {
    class: "button button-primary",
    href: certificate.pdf,
    target: "_blank",
    rel: "noopener",
  }, "PDF öffnen");

  closeButton.append(closeIcon);
  form.append(closeButton);
  preview.append(previewImage);
  actions.append(pdfLink);

  if (certificate.externalUrl) {
    actions.append(createElement("a", {
      class: "button button-secondary",
      href: certificate.externalUrl,
      target: "_blank",
      rel: "noopener",
    }, certificate.externalLabel));
  }

  content.append(title, description, preview, actions);
  dialog.append(form, content);
  return dialog;
}

async function renderCertificates() {
  const certificateList = document.querySelector("[data-certificates]");
  const dialogContainer = document.querySelector("[data-certificate-dialogs]");

  if (!certificateList || !dialogContainer) {
    return;
  }

  const response = await fetch("data/certificates.json");

  if (!response.ok) {
    throw new Error("Zertifikate konnten nicht geladen werden.");
  }

  const certificates = await response.json();

  certificateList.textContent = "";
  dialogContainer.textContent = "";
  certificateList.append(...certificates.map(createCertificateCard));
  dialogContainer.append(...certificates.map(createCertificateDialog));
}

function showCertificateError() {
  const certificateList = document.querySelector("[data-certificates]");

  if (!certificateList) {
    return;
  }

  certificateList.textContent = "";
  certificateList.append(createElement("li", { class: "certificate-error" }, "Zertifikate konnten nicht geladen werden."));
}

// Zertifikatsdialoge öffnen
function initCertificateDialogs() {
  const certificateButtons = document.querySelectorAll(".certificate-badge-link[aria-controls]");

  certificateButtons.forEach((button) => {
    const dialogId = button.getAttribute("aria-controls");
    const dialog = document.getElementById(dialogId);

    if (!dialog || typeof dialog.showModal !== "function") {
      return;
    }

    button.addEventListener("click", () => {
      dialog.showModal();
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });
}

// Beta-Anmeldung per E-Mail vorbereiten
function initBetaTestDialog() {
  const betaButton = document.querySelector('[aria-controls="beta-test-dialog"]');
  const dialog = document.getElementById("beta-test-dialog");
  const form = document.querySelector("[data-beta-form]");
  const addPersonButton = document.querySelector("[data-add-beta-person]");
  const peopleList = document.querySelector("[data-beta-people]");

  if (!betaButton || !dialog || typeof dialog.showModal !== "function" || !form) {
    return;
  }

  const updatePersonNumbers = () => {
    if (!peopleList) {
      return;
    }

    peopleList.querySelectorAll(".additional-person").forEach((fieldset, index) => {
      const personNumber = index + 1;
      const legend = fieldset.querySelector("legend");
      const removeButton = fieldset.querySelector(".additional-person-remove");

      if (legend) {
        legend.textContent = `Person ${personNumber}`;
      }

      removeButton?.setAttribute("aria-label", `Person ${personNumber} entfernen`);
    });
  };

  const addPersonFieldset = () => {
    if (!peopleList) {
      return;
    }

    const personNumber = peopleList.querySelectorAll(".additional-person").length + 1;
    const fieldId = `beta-person-${Date.now()}-${personNumber}`;

    const fieldset = createElement("fieldset", { class: "additional-person" });
    const legend = createElement("legend", {}, `Person ${personNumber}`);
    const removeButton = createElement("button", {
      class: "additional-person-remove",
      type: "button",
      "aria-label": `Person ${personNumber} entfernen`,
    });
    const removeIcon = createElement("span", {
      class: "icon icon-user-minus",
      "aria-hidden": "true",
    });
    const removeText = createElement("span", { class: "button-text" }, "Entfernen");
    const nameField = createElement("div", { class: "form-field" });
    const nameId = `${fieldId}-name`;
    const nameLabel = createElement("label", { for: nameId }, "Name");
    const nameInput = createElement("input", {
      id: nameId,
      name: "additionalPersonName",
      type: "text",
      autocomplete: "name",
    });
    const emailField = createElement("div", { class: "form-field" });
    const emailId = `${fieldId}-email`;
    const emailLabel = createElement("label", { for: emailId }, "E-Mail");
    const emailGroup = createElement("div", { class: "email-input-group" });
    const emailInput = createElement("input", {
      id: emailId,
      name: "additionalPersonEmailLocal",
      type: "text",
      inputmode: "email",
      autocomplete: "username",
      "aria-describedby": `${fieldId}-email-hint`,
    });
    const atSign = createElement("span", { "aria-hidden": "true" }, "@");
    const emailDomain = createElement("select", {
      name: "additionalPersonEmailDomain",
      "aria-label": "E-Mail-Domain",
    });
    const gmailOption = createElement("option", { value: "gmail.com", selected: "selected" }, "gmail.com");
    const googlemailOption = createElement("option", { value: "googlemail.com" }, "googlemail.com");
    const emailHint = createElement("p", {
      class: "field-hint",
      id: `${fieldId}-email-hint`,
    }, "Für den Google-Play-Test wird eine Gmail- oder Googlemail-Adresse benötigt.");

    emailDomain.append(gmailOption, googlemailOption);
    emailGroup.append(emailInput, atSign, emailDomain);
    nameField.append(nameLabel, nameInput);
    emailField.append(emailLabel, emailGroup, emailHint);
    removeButton.append(removeIcon, removeText);
    removeButton.addEventListener("click", () => {
      fieldset.remove();
      updatePersonNumbers();
      addPersonButton?.focus();
    });

    fieldset.append(legend, removeButton, nameField, emailField);
    peopleList.append(fieldset);
    nameInput.focus();
  };

  betaButton.addEventListener("click", () => {
    dialog.showModal();
  });

  addPersonButton?.addEventListener("click", addPersonFieldset);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim() || "";
    const emailLocal = formData.get("emailLocal")?.toString().trim() || "";
    const emailDomain = formData.get("emailDomain")?.toString().trim() || "gmail.com";
    const email = `${emailLocal}@${emailDomain}`;
    const additionalNames = formData.getAll("additionalPersonName").map((value) => value.toString().trim());
    const additionalEmailLocals = formData.getAll("additionalPersonEmailLocal").map((value) => value.toString().trim());
    const additionalEmailDomains = formData.getAll("additionalPersonEmailDomain").map((value) => value.toString().trim() || "gmail.com");
    const additionalEmails = additionalEmailLocals.map((value, index) => value ? `${value}@${additionalEmailDomains[index] || "gmail.com"}` : "");

    if (!emailLocal) {
      form.elements.emailLocal.setCustomValidity("Bitte gib den vorderen Teil deiner Gmail- oder Googlemail-Adresse ein.");
      form.elements.emailLocal.reportValidity();
      form.elements.emailLocal.setCustomValidity("");
      return;
    }

    const additionalPeople = additionalNames
      .map((personName, index) => {
        const personEmail = additionalEmails[index] || "";

        if (!personName && !personEmail) {
          return "";
        }

        return `- ${personName || "Ohne Namen"}: ${personEmail || "Keine E-Mail angegeben"}`;
      })
      .filter(Boolean)
      .join("\n") || "Keine weiteren Personen angegeben.";
    const subject = "Beta-Test Anmeldung PlanTeller";
    const body = [
      "Hallo,",
      "",
      "ich möchte mich für den Beta-Test von PlanTeller anmelden.",
      "",
      `Name: ${name}`,
      `E-Mail: ${email}`,
      "",
      "Weitere Personen:",
      additionalPeople,
      "",
      "Viele Grüße",
      name,
    ].join("\n");

    window.location.href = `mailto:kochbuch_app@outlook.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    dialog.close();
  });
}

// Kontaktformular per E-Mail vorbereiten
function initContactDialogs() {
  const contactButtons = document.querySelectorAll('[aria-controls="contact-dialog"]');

  contactButtons.forEach((button) => {
    const dialog = document.getElementById(button.getAttribute("aria-controls"));
    const form = dialog?.querySelector("[data-contact-form]");

    if (!dialog || typeof dialog.showModal !== "function" || !form) {
      return;
    }

    button.addEventListener("click", () => {
      dialog.showModal();
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = formData.get("name")?.toString().trim() || "";
      const email = formData.get("email")?.toString().trim() || "";
      const subject = formData.get("subject")?.toString().trim() || "Kontakt über Portfolio";
      const message = formData.get("message")?.toString().trim() || "";
      const body = [
        "Hallo Tim,",
        "",
        message,
        "",
        "Kontaktangaben:",
        `Name: ${name}`,
        `E-Mail: ${email}`,
      ].join("\n");

      window.location.href = `mailto:tim.koch1@iu-study.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      dialog.close();
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
initBetaTestDialog();
initContactDialogs();
renderCertificates()
  .then(initCertificateDialogs)
  .catch((error) => {
    console.error(error);
    showCertificateError();
  });
initShareLinks();
initBackButtons();
