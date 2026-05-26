# Portfolio Website

Dieses Repository enthält die erste Phase meiner Portfolio-Website für das Modul Webprogrammierung.
Im Fokus stehen gut strukturierter, semantischer HTML-Code, eine sinnvolle Projektstruktur und erste Grundlagen für Barrierefreiheit und Gestaltung.

## Inhalt

Die Website besteht aktuell aus folgenden Seiten:

- `index.html` - Startseite mit kurzer Vorstellung, Teaserkarten und ausgewählten Arbeiten
- `about.html` - Informationen über mich, Skills, Werdegang und Interessen
- `video.html` - Videografie-Seite mit vorbereiteten Videokarten und Dialog-Struktur
- `projects.html` - Projektübersicht mit Technologien, Links und einer Beispiel-PDF
- `imprint.html` - Impressum mit rechtlichen Angaben für das Projekt
- `404.html` - Fehlerseite für nicht gefundene Seiten

## Projektstruktur

```text
.
├── assets/
│   ├── documents/
│   ├── fonts/
│   ├── images/
│   └── videos/
├── css/
│   └── style.css
├── js/
│   └── main.js
├── index.html
├── about.html
├── video.html
├── projects.html
├── imprint.html
└── 404.html
```

## Technik

- HTML5
- CSS3
- lokale Schriftdatei: Inter als WOFF2
- WebP-Bilder zur besseren Performance
- vorbereitete Videoeinbindung mit `preload="metadata"`

JavaScript ist aktuell nur als Datei vorbereitet. Interaktive Funktionen wie Navigation, Einstellungen oder Videodialoge werden in einer späteren Phase ergänzt.

## Barrierefreiheit

In Phase 1 wurden bereits Grundlagen für Barrierefreiheit berücksichtigt:

- semantische HTML-Struktur mit `header`, `main`, `section`, `nav` und `footer`
- Skip-Link zum Hauptinhalt
- beschreibende Alternativtexte für Bilder
- sinnvolle Überschriftenhierarchie
- vorbereitete ARIA-Attribute für Navigation und Dialoge
- sichtbarer Fokuszustand im CSS

## Lokale Nutzung

Die Website kann direkt im Browser geöffnet werden. Dafür reicht es, die Datei `index.html` zu öffnen.


## Aktueller Stand

Phase 1 ist inhaltlich abgeschlossen. Die Seitenstruktur, Medienordner, Grundgestaltung und Inhalte sind vorbereitet.

In Phase 2 wird der Webauftritt gestalterisch und technisch weiter ausgearbeitet. Die Inhalte erhalten mit CSS ihr geplantes Aussehen und eine übersichtliche, responsive Anordnung. Dabei sollen Flexbox und/oder Grid sowie Media Queries eingesetzt werden, damit die Seiten auf Desktop- und Smartphone-Ansichten gut nutzbar bleiben.

Zusätzlich wird das Konzept in Phase 2 auf Basis von Feedback, Reflexion und weiterer Erfahrung überarbeitet. Änderungen am Konzept werden dokumentiert und begründet.
