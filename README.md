# Ligavo Website

Statische Website (HTML/CSS/JS, keine Build-Tools nötig) auf Basis des Ligavo-Styleguides (`Ligavo_UI.pdf`) und der Texte aus dem Ligavo-Drive-Ordner (Marketingstrategie, Pitchdeck, Preismodell).

## Lokal ansehen
```
cd ligavo-website
python3 -m http.server 8000
```
Dann `http://localhost:8000` öffnen. Alternativ `index.html` direkt per Doppelklick im Browser öffnen.

## Struktur
- `index.html` — Landingpage (Hero, Problem, So funktioniert's, Produkt, Preismodell, Über uns, Signup)
- `impressum.html`, `datenschutz.html` — **Platzhalter**, siehe unten
- `styles.css`, `script.js`
- `assets/` — Logo/Icon aus dem PDF extrahiert (Lockup hell/dunkel, App-Icon, Favicons)

## Vor dem Live-Schalten unbedingt erledigen

1. **Impressum & Datenschutz ausfüllen.** Beide Seiten sind bewusst als Platzhalter markiert (rot hinterlegter Warnhinweis) — Firmenname/Rechtsform, Anschrift, Registereintrag etc. fehlen noch. Das ist in Deutschland Pflicht (§ 5 TMG), bitte nicht ohne diese Angaben live schalten.
2. **Kontaktformular.** Das Formular am Ende der Seite baut aktuell einen `mailto:`-Link (öffnet das lokale Mailprogramm) — es gibt noch kein Backend. Funktioniert zuverlässig, ist aber kein Ersatz für ein echtes Formular/CRM, sobald mehr Volumen reinkommt.
3. **E-Mail-Adressen prüfen.** Die Seite verlinkt auf `info@ligavo.de` und `betriebe@ligavo.de` — bitte sicherstellen, dass beide Postfächer eingerichtet sind.

## Deployment auf ligavo.de (IONOS)

Laut Rechnung in eurem Drive läuft `ligavo.de` bereits auf einem **IONOS „Hosting für WordPress Grow"**-Paket. Zwei Wege:

- **Einfach (empfohlen für jetzt):** Im IONOS-Kundencenter File-Manager oder per FTP/SFTP in das Webroot-Verzeichnis wechseln und den Inhalt dieses Ordners (alle Dateien aus `ligavo-website/`) hochladen. Eine reine HTML/CSS/JS-Seite läuft auf jedem Hosting-Paket, auch wenn WordPress vorinstalliert ist — WordPress muss dafür nicht aktiv genutzt werden.
- **Alternative:** Die Inhalte als WordPress-Theme/Seite einbauen, falls ihr langfristig im WordPress-Editor weiterarbeiten wollt. Das ist deutlich mehr Aufwand (Theme bauen oder Page-Builder nachbauen) und für den aktuellen Stand nicht nötig.

## Inhaltliche Quellen
Texte stammen aus `Ligavo_Marketingstrategie`, `Ligavo_Pitchdeck_Handwerksbetriebe` und der UI-Styleguide-PDF (alle im Ligavo-Drive-Ordner). Die "Für Bauherren"-Schritte im Abschnitt "So funktioniert's" sind eigenständig formuliert (dazu gab es noch keinen fertigen Text) — bitte gegenlesen.
