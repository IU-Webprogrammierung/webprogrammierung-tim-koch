// Einstellungen und gespeicherte Darstellungsoptionen
const defaultSettings = {
  fontSize: 16,
  theme: "light",
  contrast: "normal",
  motion: "full",
};

const settingsStorageKey = "portfolio-settings";
const dialogCloseFallbackDelay = 700;

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

    button.setAttribute("aria-checked", String(isActive));
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

// Gemeinsame Seitenelemente aus Partials laden
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

function initHeaderScrollState() {
  let ticking = false;

  const updateScrollState = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > 8);
    ticking = false;
  };

  updateScrollState();

  window.addEventListener("scroll", () => {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(updateScrollState);
  }, { passive: true });
}

// Gemeinsame Dialogsteuerung
function prefersReducedMotion() {
  return document.body.dataset.motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function closeDialogWithAnimation(dialog) {
  if (!dialog || !dialog.open) {
    return Promise.resolve();
  }

  if (prefersReducedMotion()) {
    dialog.close();
    return Promise.resolve();
  }

  dialog.dataset.closing = "true";

  return new Promise((resolve) => {
    let didClose = false;
    let fallbackTimer;

    const finishClose = () => {
      if (didClose) {
        return;
      }

      didClose = true;
      window.clearTimeout(fallbackTimer);
      dialog.removeEventListener("transitionend", handleTransitionEnd);
      dialog.close();
      delete dialog.dataset.closing;
      resolve();
    };

    const handleTransitionEnd = (event) => {
      if (event.target === dialog) {
        finishClose();
      }
    };

    dialog.addEventListener("transitionend", handleTransitionEnd);
    fallbackTimer = window.setTimeout(finishClose, dialogCloseFallbackDelay);
  });
}

function initAnimatedDialogClosing() {
  document.addEventListener("submit", (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || !form.matches('.site-dialog form[method="dialog"]')) {
      return;
    }

    event.preventDefault();
    closeDialogWithAnimation(form.closest("dialog"));
  });

  document.addEventListener("cancel", (event) => {
    const dialog = event.target;

    if (!(dialog instanceof HTMLDialogElement)) {
      return;
    }

    event.preventDefault();
    closeDialogWithAnimation(dialog);
  });
}

function updateUrlHash(hash = "") {
  const url = new URL(window.location.href);
  url.hash = hash;
  window.history.replaceState(window.history.state, "", url);
}

function openVideoDialog(dialog, updateUrl = false) {
  if (!(dialog instanceof HTMLDialogElement) || typeof dialog.showModal !== "function" || dialog.open) {
    return;
  }

  dialog.showModal();

  if (updateUrl) {
    updateUrlHash(dialog.id);
  }

  requestAnimationFrame(() => {
    dialog.querySelectorAll("video[data-src]").forEach((video) => {
      if (!video.src) {
        video.src = video.dataset.src;
        video.load();
      }
    });

    dialog.querySelectorAll("iframe[data-src]").forEach((iframe) => {
      iframe.src = iframe.dataset.src;
    });
  });
}

function getDialogFromHash(selector) {
  if (!window.location.hash) {
    return null;
  }

  let dialogId;

  try {
    dialogId = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return null;
  }

  const dialog = document.getElementById(dialogId);

  return dialog?.matches(selector) ? dialog : null;
}

// Videodialoge und Direktlinks
function initVideoDialogs() {
  const videoButtons = document.querySelectorAll(".video-card-button[aria-controls]");
  const syncDialogWithHash = async () => {
    const hashDialog = getDialogFromHash(".video-dialog");
    const openDialogs = document.querySelectorAll(".video-dialog[open]");

    await Promise.all(Array.from(openDialogs, (dialog) => {
      return dialog === hashDialog ? Promise.resolve() : closeDialogWithAnimation(dialog);
    }));

    openVideoDialog(hashDialog);
  };

  videoButtons.forEach((button) => {
    const dialogId = button.getAttribute("aria-controls");
    const dialog = document.getElementById(dialogId);

    if (!dialog || typeof dialog.showModal !== "function") {
      return;
    }

    button.addEventListener("click", () => {
      openVideoDialog(dialog, true);
    });

    dialog.addEventListener("close", () => {
      dialog.querySelectorAll("video").forEach((video) => {
        video.pause();
        video.removeAttribute("src");
        video.load();
      });

      dialog.querySelectorAll("iframe[data-src]").forEach((iframe) => {
        iframe.removeAttribute("src");
      });

      if (getDialogFromHash(".video-dialog") === dialog) {
        updateUrlHash();
      }
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        closeDialogWithAnimation(dialog);
      }
    });
  });

  window.addEventListener("hashchange", syncDialogWithHash);
  syncDialogWithHash();
}

// DOM- und Formularhilfen
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

async function sendForm(form, formData) {
  const endpoint = form.dataset.formEndpoint;

  if (!endpoint) {
    throw new Error("Kein Formular-Endpunkt vorhanden.");
  }

  const response = await fetch(endpoint, {
    method: form.getAttribute("method") || "post",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Formular konnte nicht gesendet werden.");
  }
}

function clearFormStatus(form) {
  const status = form.querySelector("[data-form-status]");

  if (!status) {
    return;
  }

  status.textContent = "";
  delete status.dataset.status;
}

function setFormStatus(form, message, type = "neutral") {
  const status = form.querySelector("[data-form-status]");

  if (!status) {
    return;
  }

  status.replaceChildren(message);
  status.dataset.status = type;
}

function setFormFallbackStatus(form, message, fallbackLink) {
  const status = form.querySelector("[data-form-status]");

  if (!status) {
    return;
  }

  const link = createElement("a", { href: fallbackLink }, "E-Mail stattdessen öffnen");

  status.textContent = "";
  status.dataset.status = "error";
  status.append(message, " ", link);
}

function setFormSubmitState(form, isSending) {
  const submitButton = form.querySelector('button[type="submit"]');

  if (!submitButton) {
    return;
  }

  if (!submitButton.dataset.defaultText) {
    submitButton.dataset.defaultText = submitButton.textContent.trim();
  }

  submitButton.disabled = isSending;
  submitButton.textContent = isSending ? "Wird gesendet..." : submitButton.dataset.defaultText;
  form.setAttribute("aria-busy", String(isSending));
}

function playFormSuccessAnimation(form) {
  if (prefersReducedMotion()) {
    return Promise.resolve();
  }

  form.classList.add("is-submitted");

  return new Promise((resolve) => {
    window.setTimeout(resolve, 220);
  });
}

function showConfirmationDialog(title, message) {
  let dialog = document.getElementById("confirmation-dialog");

  if (!dialog) {
    dialog = createElement("dialog", {
      class: "site-dialog confirmation-dialog",
      id: "confirmation-dialog",
      "aria-labelledby": "confirmation-dialog-title",
      "aria-describedby": "confirmation-dialog-description",
    });

    const form = createElement("form", {
      class: "dialog-content confirmation-dialog-content",
      method: "dialog",
    });
    const heading = createElement("h2", { id: "confirmation-dialog-title" });
    const text = createElement("p", { id: "confirmation-dialog-description" });
    const button = createElement("button", { class: "button button-primary", type: "submit" }, "Bestätigen");

    form.append(heading, text, button);
    dialog.append(form);
    document.body.append(dialog);
  }

  dialog.querySelector("h2").textContent = title;
  dialog.querySelector("p").textContent = message;
  dialog.showModal();
}

function createMailtoLink(form, subject, body) {
  const recipient = form.dataset.mailtoFallback;

  if (!recipient) {
    return "";
  }

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Zertifikate aus den JSON-Daten aufbauen
function createCertificateCard(certificate) {
  const accessibleTitle = certificate.shortTitle || certificate.title;
  const item = createElement("li");
  const button = createElement("button", {
    class: "certificate-badge-link",
    type: "button",
    "aria-haspopup": "dialog",
    "aria-controls": `certificate-dialog-${certificate.id}`,
    "aria-label": `${accessibleTitle}: Zertifikat von ${certificate.provider} anzeigen`,
  });
  const badge = createElement("img", {
    src: certificate.badge,
    alt: certificate.badgeAlt,
    width: certificate.badgeWidth,
    height: certificate.badgeHeight,
    loading: "lazy",
    decoding: "async",
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
    class: "site-dialog certificate-dialog",
    id: `certificate-dialog-${certificate.id}`,
    "aria-labelledby": `certificate-dialog-${certificate.id}-title`,
    "aria-describedby": `certificate-dialog-${certificate.id}-description`,
  });
  const form = createElement("form", {
    class: "dialog-close-form",
    method: "dialog",
  });
  const closeButton = createElement("button", {
    type: "submit",
    "aria-label": "Zertifikat schließen",
  });
  const closeIcon = createElement("span", {
    class: "icon icon-close-light",
    "aria-hidden": "true",
  });
  const content = createElement("div", { class: "dialog-content certificate-dialog-content" });
  const title = createElement("h2", { id: `certificate-dialog-${certificate.id}-title` }, certificate.shortTitle || certificate.title);
  const description = createElement("p", { id: `certificate-dialog-${certificate.id}-description` }, certificate.description);
  const preview = createElement("figure", { class: "certificate-preview" });
  const previewImage = createElement("img", {
    src: certificate.preview || certificate.badge,
    alt: certificate.previewAlt || `Vorschau des Zertifikats ${certificate.title}`,
    width: certificate.previewWidth || certificate.badgeWidth,
    height: certificate.previewHeight || certificate.badgeHeight,
    loading: "lazy",
    decoding: "async",
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
  certificateList.append(createElement("li", {
    class: "certificate-error",
    role: "status",
    "aria-atomic": "true",
  }, "Zertifikate konnten nicht geladen werden."));
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
        closeDialogWithAnimation(dialog);
      }
    });
  });
}

// Beta-Anmeldung versenden
function initBetaTestDialog() {
  const betaButton = document.querySelector('[aria-controls="beta-test-dialog"]');
  const dialog = document.getElementById("beta-test-dialog");
  const form = document.querySelector("[data-beta-form]");
  const addPersonButton = document.querySelector("[data-add-beta-person]");
  const peopleList = document.querySelector("[data-beta-people]");

  if (!betaButton || !dialog || typeof dialog.showModal !== "function" || !form) {
    return;
  }

  const openBetaDialog = (updateUrl = false) => {
    if (!dialog.open) {
      dialog.showModal();
    }

    if (updateUrl) {
      updateUrlHash(dialog.id);
    }
  };

  const syncDialogWithHash = () => {
    if (getDialogFromHash(".beta-dialog") === dialog) {
      openBetaDialog();
    } else if (dialog.open) {
      closeDialogWithAnimation(dialog);
    }
  };

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
      const removeFieldset = () => {
        fieldset.remove();
        updatePersonNumbers();
        addPersonButton?.focus();
      };

      if (prefersReducedMotion()) {
        removeFieldset();
        return;
      }

      fieldset.classList.add("is-removing");
      fieldset.addEventListener("animationend", removeFieldset, { once: true });
    });

    fieldset.append(legend, removeButton, nameField, emailField);
    peopleList.append(fieldset);
    fieldset.classList.add("is-entering");
    fieldset.addEventListener("animationend", () => {
      fieldset.classList.remove("is-entering");
    }, { once: true });
    nameInput.focus();
  };

  betaButton.addEventListener("click", () => {
    openBetaDialog(true);
  });

  addPersonButton?.addEventListener("click", addPersonFieldset);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialogWithAnimation(dialog);
    }
  });

  dialog.addEventListener("close", () => {
    if (getDialogFromHash(".beta-dialog") === dialog) {
      updateUrlHash();
    }
  });

  window.addEventListener("hashchange", syncDialogWithHash);
  syncDialogWithHash();

  form.addEventListener("submit", async (event) => {
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
    const fallbackBody = [
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
    const fallbackLink = createMailtoLink(form, subject, fallbackBody);

    formData.set("name", name);
    formData.set("email", email);
    formData.set("emailLocal", emailLocal);
    formData.set("emailDomain", emailDomain);
    formData.set("additionalPeople", additionalPeople);
    formData.set("_subject", subject);

    clearFormStatus(form);
    setFormStatus(form, "Anmeldung wird gesendet.");
    setFormSubmitState(form, true);

    try {
      await sendForm(form, formData);
      await playFormSuccessAnimation(form);
      form.reset();
      peopleList.textContent = "";
      clearFormStatus(form);
      await closeDialogWithAnimation(dialog);
      form.classList.remove("is-submitted");
      showConfirmationDialog("Anmeldung gesendet", "Danke, deine Anmeldung für den PlanTeller-Beta-Test wurde gesendet.");
    } catch {
      if (fallbackLink) {
        setFormFallbackStatus(form, "Die Anmeldung konnte nicht gesendet werden.", fallbackLink);
      } else {
        setFormStatus(form, "Die Anmeldung konnte nicht gesendet werden. Bitte versuche es später erneut.", "error");
      }
    } finally {
      setFormSubmitState(form, false);
    }
  });
}

// Kontaktformular versenden
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
        closeDialogWithAnimation(dialog);
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = formData.get("name")?.toString().trim() || "";
      const email = formData.get("email")?.toString().trim() || "";
      const subject = formData.get("subject")?.toString().trim() || "Kontakt über Portfolio";
      const message = formData.get("message")?.toString().trim() || "";
      const fallbackBody = [
        "Hallo Tim,",
        "",
        message,
        "",
        "Kontaktangaben:",
        `Name: ${name}`,
        `E-Mail: ${email}`,
      ].join("\n");
      const fallbackLink = createMailtoLink(form, subject, fallbackBody);

      formData.set("name", name);
      formData.set("email", email);
      formData.set("subject", subject);
      formData.set("message", message);
      formData.set("_subject", subject);

      clearFormStatus(form);
      setFormStatus(form, "Nachricht wird gesendet.");
      setFormSubmitState(form, true);

      try {
        await sendForm(form, formData);
        await playFormSuccessAnimation(form);
        form.reset();
        clearFormStatus(form);
        await closeDialogWithAnimation(dialog);
        form.classList.remove("is-submitted");
        showConfirmationDialog("Nachricht gesendet", "Danke, deine Nachricht wurde gesendet. Ich melde mich bei dir.");
      } catch {
        if (fallbackLink) {
          setFormFallbackStatus(form, "Die Nachricht konnte nicht gesendet werden.", fallbackLink);
        } else {
          setFormStatus(form, "Die Nachricht konnte nicht gesendet werden. Bitte versuche es später erneut.", "error");
        }
      } finally {
        setFormSubmitState(form, false);
      }
    });
  });
}

// Teilen und ergänzende Seitenaktionen
function initShareLinks() {
  const shareLinks = document.querySelectorAll(".video-share-link");
  const shareStatus = createElement("p", {
    class: "visually-hidden",
    role: "status",
    "aria-live": "polite",
    "aria-atomic": "true",
  });

  if (shareLinks.length) {
    document.body.append(shareStatus);
  }

  shareLinks.forEach((link) => {
    let feedbackTimer;
    const defaultLabel = link.getAttribute("aria-label") || "Video teilen";

    const showShareFeedback = (message) => {
      window.clearTimeout(feedbackTimer);
      link.dataset.shareFeedback = message;
      link.classList.add("has-feedback");
      link.setAttribute("aria-label", message);
      shareStatus.textContent = message;

      feedbackTimer = window.setTimeout(() => {
        link.classList.remove("has-feedback");
        delete link.dataset.shareFeedback;
        link.setAttribute("aria-label", defaultLabel);
        shareStatus.textContent = "";
      }, 1800);
    };

    link.addEventListener("click", async (event) => {
      const dialog = link.closest(".video-dialog");
      const shareUrl = new URL(window.location.href);
      const shareTitle = dialog?.querySelector("h2")?.textContent || document.title;
      let nativeShareFailed = false;

      if (dialog?.id) {
        shareUrl.hash = dialog.id;
      }

      if (navigator.share) {
        event.preventDefault();

        try {
          await navigator.share({
            title: shareTitle,
            url: shareUrl.href,
          });
          return;
        } catch (error) {
          if (error.name === "AbortError") {
            return;
          }

          nativeShareFailed = true;
        }
      }

      if (navigator.clipboard) {
        event.preventDefault();

        try {
          await navigator.clipboard.writeText(shareUrl.href);
          showShareFeedback("Link wurde kopiert");
        } catch {
          showShareFeedback("Link konnte nicht kopiert werden");
        }

        return;
      }

      if (nativeShareFailed) {
        showShareFeedback("Teilen ist in diesem Browser nicht möglich");
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

function initPrintButtons() {
  const printButtons = document.querySelectorAll("[data-print-page]");

  printButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.print();
    });
  });
}

// Anwendung initialisieren
async function initLayoutPartials() {
  const partialContainers = document.querySelectorAll("[data-partial]");

  await Promise.all(Array.from(partialContainers, loadPartial));
  markCurrentNavigationLink();
  initSettingsControls();
  initMenuToggle();
  initHeaderScrollState();
}

initLayoutPartials().catch((error) => {
  console.error(error);
});

initVideoDialogs();
initBetaTestDialog();
initContactDialogs();
initAnimatedDialogClosing();
renderCertificates()
  .then(initCertificateDialogs)
  .catch((error) => {
    console.error(error);
    showCertificateError();
  });
initShareLinks();
initBackButtons();
initPrintButtons();
