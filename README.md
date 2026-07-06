# Edelweisschen Streamplan

Dieses Paket trennt die öffentliche Streamplan-Webseite und die Pflegeoberfläche sauber voneinander.

## Öffentliche Webseite

Die öffentliche Seite besteht nur aus:

```text
index.html
css/
js/
assets/
data/streamplan.json
```

`index.html` zeigt ausschließlich den Streamplan, den Light-/Dark-Mode-Toggle, den Listen-/Cards-Ansichtsschalter, öffentliche Social-/Plattform-Links und die Edelweiß-Grafiken. Es gibt keinen öffentlichen Admin-Link, keinen Login, keinen Token-Bereich und keine Bearbeitungslogik in den öffentlichen Dateien.

Die öffentliche Seite lädt auf GitHub Pages oder über einen lokalen Webserver weiterhin:

```text
data/streamplan.json
```

Beim direkten Öffnen der `index.html` per Doppelklick oder auf dem Smartphone wird ein eingebauter Fallback-Plan verwendet, damit die Vorschau auch ohne lokalen Webserver sichtbar bleibt.


## Ansicht umschalten

Die öffentliche Seite ist kompakter gestaltet und startet standardmäßig in der Listenansicht. Über den kleinen Schalter unter dem Wochenzeitraum kann zwischen diesen Ansichten gewechselt werden:

- **Liste:** besonders kompakt, damit auf Desktop und Smartphone weniger gescrollt werden muss.
- **Cards:** Tagesboxen werden nebeneinander angezeigt, sobald genug Breite vorhanden ist.

Die gewählte Ansicht wird lokal im Browser gespeichert. Beim direkten Öffnen der `index.html` per Doppelklick funktioniert der Schalter ebenfalls.

## Lokales Bearbeitungs-Tool

Das Bearbeiten erfolgt ausschließlich über das lokale Tool:

```text
tools/streamplan-editor/index.html
```

Dieses Tool ist für die Streamerin/Admins gedacht und schreibt beim Speichern über die GitHub-API direkt in:

```text
data/streamplan.json
```

Es erstellt dabei wie bisher einen Commit über den GitHub-Contents-Endpunkt und berücksichtigt die aktuelle Datei-`sha`.

## Lokalen Editor starten

Empfohlen unter Windows:

1. ZIP vollständig entpacken.
2. In diesen Ordner wechseln:

   ```text
   tools/streamplan-editor/
   ```

3. `start-editor.bat` doppelklicken.
4. Browser öffnen bzw. automatisch öffnen lassen unter:

   ```text
   http://localhost:8787/tools/streamplan-editor/
   ```

Das Startskript startet den lokalen Server bewusst im Projekt-Hauptordner, damit der Editor die zentrale Datei `data/streamplan.json` lesen kann, ohne eine Kopie anzulegen.

## GitHub-Token

Der GitHub-Token ist nicht im Code hinterlegt. Im lokalen Editor können Owner, Repository, Branch, Dateipfad und Token eingetragen werden.

Für einen Fine-grained Token werden mindestens Rechte zum Lesen und Schreiben des Repository-Inhalts benötigt, also **Contents: Read and write**. Der Token bleibt standardmäßig nur im Eingabefeld. Optional kann er bewusst für die aktuelle Browser-Sitzung in `sessionStorage` gemerkt werden.

## GitHub Pages sicher bereitstellen

Wichtig: Wenn du das komplette Repository über „Deploy from branch / root“ veröffentlichst, können grundsätzlich auch andere Ordner des Repositories statisch ausgeliefert werden. Damit das lokale Tool nicht über GitHub Pages erreichbar ist, gibt es zwei saubere Möglichkeiten:

1. **Empfohlen:** GitHub Pages über den enthaltenen GitHub-Actions-Workflow veröffentlichen. Der Workflow kopiert nur die öffentlichen Dateien in das Pages-Artefakt und lässt `tools/` außen vor.
2. Alternativ den Ordner `tools/` nicht in den Branch/Ordner legen, der von GitHub Pages veröffentlicht wird, sondern nur lokal für die Admins behalten.

Der öffentliche Streamplan selbst enthält keine sichtbare oder technische Verlinkung zum lokalen Editor.

## Aktuelle Beispieldaten

- Montag, 06.07.2026: Split Fiction mit Kalle
- Dienstag, 07.07.2026: TBA – to be announced
- Mittwoch, 08.07.2026: TBA – to be announced
- Donnerstag, 09.07.2026: TBA – to be announced
- Freitag, 10.07.2026: TBA – to be announced
- Samstag, 11.07.2026: Off-Day
- Sonntag, 12.07.2026: TBA – to be announced

Für Split Fiction ist weiterhin ein Twitch-Cover hinterlegt. Zusätzlich ist ein eingebetteter SVG-Fallback vorhanden, damit bei der lokalen Vorschau kein kaputtes Bildsymbol erscheint.
