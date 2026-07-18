# Portfolio-Website

Portfolio-Projekt für das Modul Webprogrammierung an der IU. Der aktuelle Stand ist unter
<https://iu-webprogrammierung.github.io/webprogrammierung-tim-koch/index.html> veröffentlicht.

## Phase 3: Finalisierung

- Echte Übermittlung des Kontakt- und Beta-Formulars über getrennte Formspree-Endpunkte
- Asynchroner Formularversand mit Lade-, Erfolgs- und Fehlerzuständen sowie vorbereitetem E-Mail-Fallback
- Dynamisch ergänzbare Personenfelder in der Beta-Anmeldung mit zugänglichen Beschriftungen und eigener Validierung
- Datenschutzfreundliche Zwei-Klick-Einbindung für YouTube über `youtube-nocookie.com`
- Direktlinks zu Videodialogen und Beta-Anmeldung über URL-Hashes; Teilen per Web Share API oder Zwischenablage
- Sticky Navigation mit scrollabhängigem Frosted-Glass-Effekt und vollständig deckender High-Contrast-Variante
- Verfeinerter Dark Mode für Karten, Formulare, Dialoge und maskierte SVG-Icons
- Dezente Karten-, Dialog-, Icon- und Formularanimationen mit vollständiger Bewegungsreduktion
- Zertifikate aus einer JSON-Datenquelle erzeugt; Vorschau im Dialog, PDF-Nachweis und externe Verifikation
- Eigene Druckansicht des Lebenslaufs über `print.css`, inklusive kontrollierter Seitenumbrüche
- Responsive Bilder über `<picture>`, AVIF, WebP, `srcset`, `sizes` und feste Bildmaße
- Priorisierung der jeweiligen LCP-Bilder mit Preload und `fetchpriority="high"`
- Vermeidung von Layout-Shifts durch reservierte Partial-Höhen, stabile Scrollleistenbreite und feste Medienformate
- Individuelle Metadaten, Canonical-URLs, Open Graph, Twitter Cards, `robots.txt` und `sitemap.xml`
- Individuelle 404-Seite mit korrektem `noindex, follow`
- Bewusster Verzicht auf ein CSS-/UI-Framework: Das eigene Komponentensystem war bereits vorhanden und blieb dadurch kleiner und nachvollziehbarer

## Phase 2: Gestaltung und Interaktion

- Mobile-First-Layout mit Breakpoints bei `768px` und `1024px`
- Eigenes responsives Layoutsystem mit CSS Grid und Flexbox für Karten, Navigation, Footer und Inhaltsbereiche
- Aufteilung des CSS in Foundations, Layout, Components, Pages, Responsive und Print
- Design Tokens über CSS-Variablen für Farben, Typografie, Abstände, Schatten und Bewegungen
- CSS Nesting zur lesbaren Bündelung von Komponenten, Zuständen und Varianten
- Wiederverwendbare Partials für Skip-Link, Einstellungen, Header und Footer, geladen per `fetch()`
- Mobiles Burger-Menü, aktive Navigation und sticky Header mit eigenem JavaScript
- Native `<dialog>`-Elemente für Videos, Zertifikate, Formulare und Bestätigungen
- Lokale Videos werden erst beim Öffnen geladen und beim Schließen zuverlässig pausiert
- Einstellungen für Schriftgröße, Dark Mode, hohen Kontrast und reduzierte Animationen
- Persistenz der gewählten Einstellungen in `localStorage`
- Lokale, variable Inter-Schrift als optimierte WOFF2-Datei

## Phase 1: Semantische Grundlage

- Sechs inhaltlich ausgearbeitete Seiten: Startseite, Über mich, Videografie, Projekte, Impressum und 404
- Semantische HTML5-Struktur mit passenden Landmarks und konsistenter Überschriftenhierarchie
- Medien, Projektkarten, Formulare und Dialogstrukturen von Beginn an inhaltlich vorbereitet
- Barrierefreie Grundlagen wie Skip-Link, Alternativtexte, Labels und ARIA-Beziehungen eingeplant
- Regelmäßige, thematisch begrenzte Commits unter Versionskontrolle

## Barrierefreiheit

- Bedienung aller zentralen Funktionen per Tastatur
- Sichtbare Fokuszustände und ausreichend große Touch-Ziele
- Fokusführung, Escape-Taste und Rückgabe des Fokus bei Dialogen
- Statusmeldungen über `role="status"` und `aria-live`
- Semantische Formulare mit Labels, Hilfetexten und browserseitiger Validierung
- Alternativtexte sowie dekorative Icons mit `aria-hidden="true"`
- Einstellbare Schriftgröße, hoher Kontrast, Dark Mode und reduzierte Animationen
- Unterstützung von `prefers-reduced-motion`
- Datenschutzinformationen direkt an den Formularen und im Impressum

## Tests und Qualitätssicherung

- JavaScript-Syntaxprüfung: `node --check js/main.js`
- JSON-Prüfung für `data/certificates.json`
- CSS-Prüfung mit Stylelint: `npm run lint:css`
- HTML-Prüfung aller sechs Seiten ohne Fehler mit dem [W3C Markup Validator](https://validator.w3.org/)
- Barrierefreiheitsprüfung aller Seiten mit WAVE; [öffentlicher Beispielbericht](https://wave.webaim.org/report#/https://iu-webprogrammierung.github.io/webprogrammierung-tim-koch/index.html)
- Manuelle Tastatur-, Dialog-, Formular-, Video-, Dark-Mode- und Responsive-Tests
- Lighthouse-Matrix für alle Seiten auf Mobile und Desktop
- Reguläre Seiten erreichen in den veröffentlichten Läufen 97-100 Punkte in Performance und 100 Punkte in Accessibility, Best Practices und SEO
- `404.html` erreicht bewusst keinen vollständigen SEO-Wert, weil die Fehlerseite korrekt von der Indexierung ausgeschlossen ist

## Erkenntnisse

- Asynchron geladene Partials benötigen reservierten Platz, damit sie keine Layout-Shifts auslösen.
- Direkte Dialoglinks erfordern eine abgestimmte Verwaltung von Hash, Browser-Historie und Fokus.
- Responsive Bildoptimierung betrifft nicht nur das Dateiformat, sondern auch intrinsische Maße, Auswahlregeln und Ladepriorität.
- Datenschutzfreundliche Einbindungen sollten externe Verbindungen erst nach einer bewussten Nutzeraktion herstellen.
- Wenige, gezielt eingesetzte Animationen wirken hochwertiger und bleiben mit einer konsequenten Bewegungsreduktion zugänglich.
- Externe Dienste wie Formspree lösen den Versand auf statischem Hosting, müssen aber technisch und datenschutzrechtlich transparent eingebunden werden.

## Projektstruktur

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
├── data/certificates.json
├── js/main.js
├── partials/
│   ├── footer.html
│   ├── header.html
│   ├── settings.html
│   └── skip-link.html
├── 404.html
├── about.html
├── imprint.html
├── index.html
├── projects.html
├── video.html
├── robots.txt
└── sitemap.xml
```

## Lokale Nutzung

Die Partials und die Zertifikatsdaten werden per `fetch()` geladen. Deshalb muss die Website über einen lokalen Server statt per Doppelklick geöffnet werden:

```bash
python3 -m http.server 8000
```

Anschließend ist die Startseite unter <http://localhost:8000/index.html> erreichbar.

## Git-Workflow

- Mehr als 80 regelmäßig über die Projektphasen verteilte Commits
- Kleine, nachvollziehbare Commits nach Funktion oder Refactoring-Schritt
- Ältere Entwicklungsstände bleiben vollständig in der Git-Historie erhalten
- Finaler Abgabestand wird im `main`-Branch gepflegt
