# Webshop - Gruppe X

## 🛒 **Projektübersicht**

Dieses Projekt ist Teil des Web-Technologie Kurses an der Alpen Adria Universität Klagenfurt. Ziel ist es, einen funktionalen Webshop zu entwickeln, der eine moderne Benutzeroberfläche mit **Angular** bietet und auf einer **Node.js**-basierten Backend-API läuft. Der Fokus liegt auf der Integration von Frontend und Backend, um eine vollständige Webanwendung bereitzustellen.

---

## 📋 **Projektziele**

-   Entwicklung einer responsiven Webshop-Oberfläche mit **Angular**.
-   Aufbau eines RESTful APIs mit **Node.js** und **Express**.
-   Verwendung einer Datenbank (**PostgreSQL**) zur Speicherung von Benutzerdaten, Produkten und Bestellungen.

---

## 🛠️ **Technologien**

Das Projekt verwendet folgende Technologien und Frameworks:

### **Frontend**

-   **Angular**: Single Page Application Framework.
-   **Tailwind**: Für ein modernes und responsives UI.

### **Backend**

-   **Node.js**: JavaScript-Laufzeitumgebung.
-   **Express**: Minimalistisches Framework für den Aufbau von Web-APIs.

### **Datenbank**

-   **PostgreSQL**: Speicherung von Benutzern, Produkten und Bestellungen.

### **Tools**

-   **Git**: Versionskontrolle.
-   **Postman**: API-Testing.

---
## 📋 **Wie kriegt man das Projekt zum laufen?**

### Setup
1. In das Verzeichnis `backend/db_imports` wechseln.
2. In folgender Reihenfolge die Skripts ausführen:
   ```bash
   1.) create_db.sql
   2.) create_tables.sql
   3.) fill_db.sql
   ```
3. Anpassen der Datei `config.json`. Diese ist unter `backend/src` zu finden.


### **Backend starten**

1. In das Verzeichnis `backend/src` wechseln.
2. Abhängigkeiten installieren:
    ```bash
    npm install
    ```
3. Entwicklungsserver starten:
    ```bash
    npm run start
    ```
4. Die API ist standardmäßig unter `http://localhost:3000` verfügbar. Darauf achten, dass kein anderes Programm einen der zwei Ports verwendet.

### **Frontend starten**

1. In das Verzeichnis `webshop` wechseln.
2. Abhängigkeiten installieren:
    ```bash
    npm install
    ```
3. Entwicklungsserver starten:
    ```bash
    ng serve
    ```
4. Öffne `http://localhost:4200` im Browser.

---

## 🔑 **Funktionen**

-   **Benutzer**:
    -   Registrierung und Login
    -   Alle Produkte ansehen
    -   Wenn angemeldet, ein bestimmtes Produkt anfragen
    -   Detaillierte Filter in jedem Marktplatz anwenden
-   **Admin**:
    -   Hinzufügen, Bearbeiten und Löschen von Produkten
    -   Übersicht und Verwaltung von Anfragen via Chat
-   **Produkte**:
    -   Kategorisierung und Filterung
    -   Produktdetails anzeigen

---

## 👥 **Mitwirkende**

-   [Philipp Arbeitstein](https://github.com/PhilippArbeitstein) [RealEstate]
-   [Thomas Wobak](https://github.com/ThomasWobak) [Vehicles]
-   [Lukas Wobak](https://github.com/l1wobak) [Retail]
