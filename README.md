# Portfolio Website

Dieses Repository enthält meine Portfolio-Website für das Modul Webprogrammierung.
Die Website wird schrittweise entwickelt und dokumentiert. Der aktuelle Stand gehört zur zweiten Phase.

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
- lokale Schriftdatei Inter als WOFF2
- optimierte WebP-Bilder
- JavaScript für Partials, aktive Navigation, Burger-Menü, Einstellungen, Videodialoge und 404-Zurück-Button
- Sticky Navigation
- lokale Videos mit `preload="metadata"`
- YouTube-Video wird erst beim Öffnen des Dialogs geladen

### Aktuelle Projektstruktur

```text
.
├── assets/
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
│   ├── responsive.css
│   └── style.css
├── js/
│   └── main.js
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

Die Bilder wurden für bessere Ladezeiten optimiert und liegen als WebP-Dateien vor. JavaScript wird mit `defer` geladen. Videos werden nicht vollständig vorgeladen. Hinweise von Lighthouse zu Cache-Headern sind serverseitig zu lösen und können bei lokaler Entwicklung nur eingeschränkt beeinflusst werden.

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
