# CIVISFERA

Civisfera è una piattaforma web pensata per trasformare problemi pratici della vita quotidiana in percorsi guidati, checklist, scadenze, documenti organizzati, generatori di messaggi e strumenti per scuola, lavoro, salute ed emergenze.

## Cosa contiene

- Home con ricerca intelligente.
- Archivio guide.
- Percorsi guidati con domande e checklist personalizzate.
- Generatore di email, messaggi formali, reclami e comunicazioni.
- Traduttore burocratico base.
- Area personale con salvataggi locali.
- Dashboard scadenze.
- Archivio documenti locale.
- Modalità “prepara la borsa”.
- Sezione scuola con planner e simulazione “Interrogami”.
- Sezione lavoro con CV e colloquio simulato.
- Sezione salute con promemoria visita e limite esplicito: non fa diagnosi.
- Sezione emergenze.
- Ricerca servizi vicini tramite link a Google Maps, senza API key.
- Assistente chatbot locale con fallback e backend opzionale Gemini.
- Impostazioni accessibilità: testo grande, contrasto alto, modalità senza distrazioni, modalità anziano.

## Struttura file

```txt
CIVISFERA/
├── index.html
├── guide.html
├── percorso.html
├── generatori.html
├── dashboard.html
├── scadenze.html
├── documenti.html
├── studio.html
├── lavoro.html
├── salute.html
├── servizi.html
├── emergenze.html
├── profilo.html
├── assets/
│   ├── css/styles.css
│   └── js/
│       ├── data.js
│       ├── app.js
│       ├── chatbot.js
│       └── pages.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── manifest.json
└── sw.js
```

## Come aprirlo senza server

Apri `index.html` nel browser. Le funzioni statiche funzionano subito.

Nota: il chatbot userà solo il motore locale, perché senza server non può proteggere una API key.

## Come avviarlo con backend Node

Da terminale dentro la cartella `CIVISFERA`:

```bash
npm install
npm start
```

Poi apri:

```txt
http://localhost:3000
```

## API Gemini opzionale

Il sito funziona anche senza API. Se vuoi collegare un chatbot reale:

1. Vai su Google AI Studio.
2. Crea o apri una API key Gemini.
3. Copia `.env.example` e rinominalo `.env`.
4. Dentro `.env` inserisci:

```env
GEMINI_API_KEY=la_tua_chiave
PORT=3000
```

5. Riavvia il server:

```bash
npm start
```

Regola di sicurezza: non inserire mai `GEMINI_API_KEY` dentro file pubblici come `index.html`, `assets/js/chatbot.js` o `assets/js/app.js`.

## Pubblicazione su GitHub Pages

GitHub Pages ospita file statici. Quindi pubblica la versione frontend, senza usare `server.js`.

Passaggi:

1. Crea una repository GitHub, per esempio `civisfera`.
2. Carica tutti i file della cartella `CIVISFERA`.
3. Vai su `Settings` della repository.
4. Apri `Pages`.
5. In `Build and deployment`, scegli `Deploy from a branch`.
6. Scegli branch `main` e cartella `/root`.
7. Salva.
8. Dopo il deploy apri il link generato da GitHub Pages.

Su GitHub Pages il chatbot resta in modalità locale. Per API Gemini serve un backend separato.

## Pubblicazione con backend

Per usare `/api/chat` con Gemini devi pubblicare anche Node/Express. Possibili opzioni:

- Render
- Railway
- Fly.io
- Vercel con adattamento serverless
- Firebase Hosting + Cloud Functions/Cloud Run

In queste piattaforme la chiave va salvata come variabile d’ambiente, non nel codice pubblico.

## Firebase

Se vuoi usare Firebase per login reale, database e salvataggi cloud, le parti da aggiungere sono:

- Firebase Authentication: email/password e Google.
- Firestore: utenti, checklist, scadenze, messaggi, percorsi, community.
- Firebase Storage: documenti caricati.
- Cloud Functions o Cloud Run: chiamate AI senza esporre chiavi.

Questa versione usa `localStorage` per essere pronta, gratuita e caricabile su GitHub Pages.

## Dati salvati

I dati vengono salvati nel browser con la chiave:

```txt
civisfera_state_v1
```

Dal profilo puoi esportare, importare o cancellare i dati.

## Limiti della versione attuale

- Non è un servizio medico e non fa diagnosi.
- Non è consulenza legale o fiscale professionale.
- Le guide sono organizzative e vanno verificate su fonti ufficiali.
- I documenti non sono salvati in cloud.
- Il login è demo, non autenticazione reale.
- La community non è ancora collegata a un database.

## Prossimi sviluppi consigliati

1. Firebase Authentication.
2. Firestore per dati sincronizzati.
3. Storage sicuro per documenti.
4. Community moderata.
5. Notifiche email o calendario.
6. Mappa integrata con API solo se serve davvero.
7. Pannello amministratore per aggiornare guide.
