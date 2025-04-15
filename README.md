# 🧠 CalMap – Mappa Concettuale Calendarizzata

**CalMap** è una webapp interattiva, minimal e moderna, progettata per smartphone e desktop, che permette di:

- Monitorare **idee**, **progetti** e **obiettivi** nel tempo
- Visualizzare **timeline verticali** e **ramificazioni orizzontali**
- Costruire percorsi alternativi, **bivi decisionali** e flussi evolutivi
- Usare la **gamification** per motivarsi nel completare i propri step

---

## 🚀 Caratteristiche principali

- 📅 **Timeline filtrabile** per giorni, mesi, anni (aggiornata automaticamente)
- 🌟 **Nodi evidenziati in neon giallo** quando legati alla data selezionata
- ➕ **Pulsante “+” sotto ogni nodo** per aggiungere nuovi step
- 🌿 **Bivi dinamici** cliccando le frecce tra due nodi
- 🖱️ **Drag & Drop** completo dei nodi (in arrivo con Cytoscape.js)
- 🎮 **Sistema a punti**: ogni obiettivo completato prima della scadenza vale 10 punti, ogni 100 punti si sale di livello
- 💡 **Design Apple-like**: scuro, leggibile, elegante e mobile-first

---

## 📁 Struttura del progetto


---

## 🛠️ Come funziona

1. La mappa mostra i progetti e i task in ordine cronologico (dall’alto verso il basso).
2. Le ramificazioni orizzontali rappresentano percorsi alternativi, evoluzioni o bivi decisionali.
3. Puoi cliccare sulla timeline per evidenziare gli impegni legati a una data.
4. Ogni nodo mostra sotto di sé un `+` per creare nuovi step personalizzati.
5. Le frecce tra i nodi possono essere cliccate per creare biforcazioni.
6. I punti si guadagnano automaticamente se completi task prima della scadenza.

---

## 🎯 Obiettivi futuri

- [ ] Spostamento libero dei nodi con drag & drop (Cytoscape.js o simili)
- [ ] Salvataggio in cloud o sincronizzazione con GitHub/Drive
- [ ] Interfaccia di modifica nodi direttamente da smartphone
- [ ] Editor integrato per timeline e task
- [ ] Export in PDF o PNG della mappa generata

---

## 🤝 Collaborazione

CalMap è pensato come **strumento modulare ed espandibile**: può essere usato da singoli, gruppi, aziende o scuole per gestire idee, progetti, roadmap e strategie.

Puoi contribuire al progetto, creare fork, o proporre miglioramenti usando un formato standardizzato:

```json
{
  "file": "script.js",
  "modifica": "Aggiungi funzione per creare nodo figlio da '+' sotto un nodo esistente",
  "condizione": "Quando si clicca sul nodo con testo '+'",
  "azione": "Crea un nuovo nodo figlio con testo 'Nuovo Nodo' e lo collega al nodo genitore",
  "extra": "Assegna classe .newNode per evidenziarlo"
}
