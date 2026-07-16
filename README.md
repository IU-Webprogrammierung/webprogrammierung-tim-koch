# Portfolio Website

Dieses Repository enthält meine Portfolio-Website für das Modul Webprogrammierung.
Die Website wird schrittweise entwickelt und dokumentiert. Der aktuelle Stand gehört zur dritten Phase.

## Phase 3:

In Phase 3 wird die Website gezielt verfeinert. Im Fokus stehen echter Formularversand, bessere Interaktionen, ein weiter ausgearbeiteter Dark Mode, eine dezente Frosted-Glass-Navigation, finale Bildoptimierung und erneute Qualitätsprüfungen.

### Bibliotheksstrategie

Für Phase 3 wird bewusst kein großes CSS- oder UI-Framework wie Bootstrap oder Tailwind eingeführt. Die Website besitzt bereits ein eigenes CSS-System mit Design Tokens, Komponenten, Layout-Dateien und responsiven Regeln. Eine vollständige Umstellung auf ein Framework würde die bestehende Struktur unnötig vergrößern und viele bereits gelöste Bereiche doppeln.

Externe Dienste oder kleine Bibliotheken werden nur eingesetzt, wenn sie einen klaren Zweck erfüllen. Geplant ist der gezielte Einsatz von Formspree für den Formularversand. Weitere Bibliotheken werden nur geprüft, wenn sie Barrierefreiheit, Wartbarkeit oder Bedienbarkeit nachweisbar verbessern.

### Formularversand

Der Formularversand wurde in Phase 3 von vorbereiteten `mailto:`-Links auf Formspree umgestellt. Das Kontaktformular und die PlanTeller-Beta-Anmeldung nutzen getrennte Formspree-Endpunkte, damit allgemeine Kontaktanfragen und App-Testanmeldungen sauber getrennt verarbeitet werden können.

Die Formulare werden per JavaScript und `fetch()` gesendet. Während des Sendens wird der jeweilige Button deaktiviert, nach dem Versand wird eine Erfolgsmeldung im Dialog angezeigt. Wenn der Versand fehlschlägt, bleiben die Eingaben erhalten und es wird ein vorbereiteter E-Mail-Fallback angeboten.

### Druckansicht

Die Über-mich-Seite besitzt eine eigene Druckansicht, die über einen sichtbaren Button und die Druckfunktion des Browsers geöffnet werden kann. Eine ausschließlich für den Druck geladene `print.css` bereitet Profil, Skills, Zertifikate, Werdegang und Interessen als kompakte A4-Seite auf. Navigation, Einstellungen, Footer, Dialoge und Bedienelemente werden beim Drucken ausgeblendet. Seitenumbrüche, Schriftgrößen und Spaltenaufteilung sind gezielt für eine gut lesbare PDF- oder Papierausgabe angepasst.

## Phase 2:

In Phase 2 wurde die Website gestalterisch und technisch ausgearbeitet. Im Fokus stehen responsives Design, eigene CSS-Struktur, einfache JavaScript-Interaktionen und eine bessere Nutzbarkeit auf verschiedenen Bildschirmgrößen.

### Aktueller Stand

Die Website besteht aktuell aus folgenden Seiten:

- `index.html` - Startseite mit kurzer Vorstellung, Teaserkarten, ausgewählten Arbeiten und Kontaktbereich
- `about.html` - Informationen über mich, Skills, Werdegang und Interessen
- `video.html` - Videografie-Seite mit Videokarten und Dialogen für lokale Videos und YouTube
- `projects.html` - Projektübersicht mit Technologien, Links und Beispiel-PDF
- `imprint.html` - Impressum mit rechtlichen Angaben für das Projekt
- `404.html` - Fehlerseite mit eigener Illustration und Navigation zurück zur Website

### Umsetzung

- eigenes CSS ohne Frameworks
- Mobile-First-Aufbau mit Media Queries
- Grid und Flexbox für Layouts und Karten
- aufgeteilte CSS-Struktur mit `foundations.css`, `layout.css`, `components.css`, `pages.css` und `responsive.css`
- CSS Nesting zur besseren Strukturierung zusammengehöriger Regeln
- lokale Schriftdatei Inter als optimierte WOFF2-Teilmenge
- optimierte WebP-Bilder
- JavaScript für Partials, aktive Navigation, Burger-Menü, Einstellungen, Videodialoge und 404-Zurück-Button
- Sticky Navigation
- lokale Videos werden erst beim Öffnen des Videodialogs geladen
- YouTube-Video wird erst beim Öffnen des Dialogs geladen

### Aktuelle Projektstruktur

```text
.
├── assets/
│   ├── badges/
│   ├── certificates/
│   ├── documents/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   └── videos/
├── css/
│   ├── components.css
│   ├── foundations.css
│   ├── layout.css
│   ├── pages.css
│   ├── print.css
│   ├── responsive.css
│   └── style.css
├── js/
│   └── main.js
├── data/
│   └── certificates.json
├── partials/
│   ├── footer.html
│   ├── header.html
│   ├── settings.html
│   └── skip-link.html
├── index.html
├── about.html
├── video.html
├── projects.html
├── imprint.html
└── 404.html
```

### Barrierefreiheit

In Phase 2 wurden die Grundlagen aus Phase 1 weitergeführt und erweitert:

- Skip-Link zum Hauptinhalt
- semantische Seitenbereiche und sinnvolle Überschriftenstruktur
- beschreibende Alternativtexte für Bilder
- ARIA-Attribute für Navigation, Einstellungen und Videodialoge
- Tastaturbedienbarkeit für Navigation, Buttons und Dialoge
- sichtbare Fokuszustände
- Einstellungen für Schriftgröße, dunklen Modus, hohen Kontrast und reduzierte Animationen

### Lokale Nutzung

Die Website sollte über einen lokalen Server geöffnet werden, weil Header, Footer, Einstellungen und Skip-Link per `fetch()` als Partials geladen werden.

Die veröffentlichte Version ist hier erreichbar:

```text
https://iu-webprogrammierung.github.io/webprogrammierung-tim-koch/index.html
```

Lokal kann die Website so gestartet werden:

```bash
python3 -m http.server 8000
```

Danach im Browser öffnen:

```text
http://localhost:8000/index.html
```

### Hinweise zu Performance

Die Bilder wurden für bessere Ladezeiten optimiert und liegen als WebP-Dateien vor. JavaScript wird mit `defer` geladen. Die lokale Inter-Schrift wird als kleinere Teilmenge geladen. Videos werden nicht vollständig vorgeladen, sondern erst beim Öffnen des jeweiligen Dialogs eingebunden. Hinweise von Lighthouse zu Cache-Headern sind serverseitig zu lösen und können bei lokaler Entwicklung nur eingeschränkt beeinflusst werden.

### Durchgeführte Tests

Die Website wurde lokal mit folgendem Server geprüft:

```bash
python3 -m http.server 8000
```

Zusätzlich wurden folgende technische Tests durchgeführt:

- `node --check js/main.js` zur Prüfung der JavaScript-Syntax
- JSON-Prüfung für `data/certificates.json`
- HTML-Prüfung mit dem W3C Markup Validator: <https://validator.w3.org>
- gefundene HTML-Strukturhinweise wurden lokal mit `html-validate` nachgeprüft
- CSS-Klammerprüfung für alle CSS-Dateien
- `npm run lint:css` zur Prüfung der CSS-Dateien mit Stylelint
- Barrierefreiheitsprüfung mit WAVE: <https://wave.webaim.org/report#/https://iu-webprogrammierung.github.io/webprogrammierung-tim-koch/index.html>
- Lighthouse-Prüfung für `index.html`, `about.html`, `video.html`, `projects.html`, `imprint.html` und `404.html`

Die Lighthouse-Prüfung wurde jeweils für Mobile und Desktop durchgeführt. Nach der Optimierung lagen alle Seiten bei mindestens 97 Punkten in Performance auf Mobile und bei 100 Punkten auf Desktop. Accessibility, Best Practices und SEO lagen auf allen geprüften Seiten bei 100 Punkten.

## Phase 1:

In Phase 1 standen gut strukturierter, semantischer HTML-Code, eine sinnvolle Projektstruktur und erste Grundlagen für Barrierefreiheit und Gestaltung im Fokus.

### Inhalte aus Phase 1

Die grundlegenden Seiten wurden als HTML-Dateien angelegt:

- `index.html` - Startseite mit kurzer Vorstellung, Teaserkarten und ausgewählten Arbeiten
- `about.html` - Informationen über mich, Skills, Werdegang und Interessen
- `video.html` - Videografie-Seite mit vorbereiteten Videokarten und Dialog-Struktur
- `projects.html` - Projektübersicht mit Technologien, Links und einer Beispiel-PDF
- `imprint.html` - Impressum mit rechtlichen Angaben für das Projekt
- `404.html` - Fehlerseite für nicht gefundene Seiten

### Projektstruktur aus Phase 1

```text
.
├── assets/
│   ├── documents/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   └── videos/
├── css/
│   └── style.css
├── js/
│   └── main.js
├── partials/
├── index.html
├── about.html
├── video.html
├── projects.html
├── imprint.html
└── 404.html
```

### Technik aus Phase 1

- HTML5
- CSS3 als vorbereitete Datei
- JavaScript als vorbereitete Datei
- lokale Schriftdatei: Inter
- WebP-Bilder zur besseren Performance
- vorbereitete Videoeinbindung mit `preload="metadata"`

### Barrierefreiheit aus Phase 1

Bereits in Phase 1 wurden Grundlagen für Barrierefreiheit berücksichtigt:

- semantische HTML-Struktur mit `header`, `main`, `section`, `nav` und `footer`
- Skip-Link zum Hauptinhalt
- beschreibende Alternativtexte für Bilder
- sinnvolle Überschriftenhierarchie
- vorbereitete ARIA-Attribute für Navigation und Dialoge
- sichtbarer Fokuszustand im CSS

### Stand nach Phase 1

Phase 1 war inhaltlich abgeschlossen. Die Seitenstruktur, Medienordner, Grundgestaltung und Inhalte waren vorbereitet. In Phase 2 wurde dieser Stand gestalterisch, responsiv und interaktiv weiterentwickelt.
