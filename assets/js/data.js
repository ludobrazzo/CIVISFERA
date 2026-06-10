window.CIVI_DATA = {
  nav: [
    ['index.html','Home'],['guide.html','Guide'],['percorso.html','Percorsi'],['generatori.html','Generatori'],['dashboard.html','Area personale'],['scadenze.html','Scadenze'],['documenti.html','Documenti'],['studio.html','Scuola'],['lavoro.html','Lavoro'],['salute.html','Salute'],['servizi.html','Servizi'],['emergenze.html','Emergenze'],['profilo.html','Profilo']
  ],
  categories: [
    {id:'documenti',title:'Documenti',icon:'🪪',page:'documenti.html',desc:'Carta d’identità, tessera sanitaria, SPID, CIE, ISEE e certificati.',keywords:'documento documenti tessera sanitaria carta identità spid cie isee certificati patente passaporto tessera elettorale'},
    {id:'scuola',title:'Scuola',icon:'📚',page:'studio.html',desc:'Studio, verifiche, interrogazioni, maturità, PCTO, email ai professori.',keywords:'scuola studio verifiche interrogazioni maturità pcto professore appunti mappe quiz'},
    {id:'universita',title:'Università',icon:'🎓',page:'guide.html?cat=universita',desc:'Orientamento, TOLC, tasse, borse di studio, ISEE universitario.',keywords:'università facoltà tolc tasse borse studio isee alloggi erasmus'},
    {id:'salute',title:'Salute',icon:'🩺',page:'salute.html',desc:'Visite, CUP, medico di base, referti, ricette e promemoria.',keywords:'salute medico cup visita referto ricetta impegnativa farmaci guardia medica pronto soccorso'},
    {id:'famiglia',title:'Famiglia',icon:'👨‍👩‍👧',page:'guide.html?cat=famiglia',desc:'Organizzazione familiare, figli, scuola, documenti e comunicazioni.',keywords:'famiglia genitori figli scuola organizzazione bonus documenti'},
    {id:'lavoro',title:'Lavoro',icon:'💼',page:'lavoro.html',desc:'CV, colloqui, contratti, diritti, stage e tirocinio.',keywords:'lavoro curriculum cv colloquio contratto stage tirocinio apprendistato diritti'},
    {id:'soldi',title:'Soldi e bonus',icon:'💶',page:'guide.html?cat=soldi',desc:'Budget, ISEE, bonus, pagamenti, rimborsi, carte e abbonamenti.',keywords:'soldi budget bonus isee carte pagamento risparmio conto corrente rimborso'},
    {id:'casa',title:'Casa',icon:'🏠',page:'guide.html?cat=casa',desc:'Affitto, utenze, residenza, bollette, contratto e vita autonoma.',keywords:'casa affitto utenze bollette residenza domicilio trasloco contratto condominio'},
    {id:'trasporti',title:'Trasporti',icon:'🚌',page:'guide.html?cat=trasporti',desc:'Tessere, abbonamenti, rimborsi, viaggi e documenti per spostarsi.',keywords:'trasporti abbonamento tessera bus treno metro rimborso viaggio'},
    {id:'emergenze',title:'Emergenze',icon:'🚨',page:'emergenze.html',desc:'Portafoglio perso, furto, telefono smarrito, carte bloccate e urgenze.',keywords:'emergenza furto smarrimento portafoglio telefono carta denuncia medico urgente'},
    {id:'diritti',title:'Diritti',icon:'⚖️',page:'guide.html?cat=diritti',desc:'Informazioni di base su diritti, reclami, richieste formali e tutela.',keywords:'diritti reclamo tutela assistenza legale richiesta formale'},
    {id:'organizzazione',title:'Organizzazione',icon:'🗓️',page:'scadenze.html',desc:'Scadenze, promemoria, checklist, appuntamenti e pratiche salvate.',keywords:'organizzazione calendario scadenze promemoria checklist appuntamenti pratica'}
  ],
  guides: [
    {
      id:'isee', cat:'soldi', title:'Come fare l’ISEE', difficulty:'Media', time:'1–7 giorni', online:true, free:true,
      summary:'Serve per università, bonus e agevolazioni. Il percorso ti aiuta a capire dati, documenti, DSU e alternative CAF.',
      keywords:'isee dsu università bonus caf patronato reddito genitori giacenza media saldo conto corrente nucleo familiare spid cie',
      docs:['Documento d’identità','Codice fiscale','SPID/CIE/CNS per richiesta online','Saldo e giacenza media dei conti','Redditi e patrimoni','Eventuale contratto d’affitto'],
      steps:['Capire per cosa serve l’ISEE','Verificare nucleo familiare e dati anagrafici','Raccogliere redditi, patrimoni e conti','Compilare la DSU online o tramite CAF','Controllare l’attestazione quando arriva','Usare l’ISEE nel servizio richiesto'],
      errors:['Confondere saldo con giacenza media','Dimenticare conti o carte prepagate','Inserire un nucleo familiare errato','Aspettare l’ultimo giorno prima della scadenza']
    },
    {
      id:'tessera-sanitaria', cat:'documenti', title:'Tessera sanitaria smarrita', difficulty:'Facile', time:'10–30 minuti', online:true, free:true,
      summary:'Guida per richiedere un duplicato e capire cosa usare nel frattempo.',
      keywords:'tessera sanitaria persa smarrita duplicato codice fiscale documento asl agenzia entrate',
      docs:['Codice fiscale','Documento d’identità','Eventuale SPID/CIE per procedura online'],
      steps:['Verifica se hai il codice fiscale disponibile','Accedi al servizio online o contatta ASL/Agenzia delle Entrate','Richiedi il duplicato','Salva una copia provvisoria se disponibile','Controlla l’indirizzo di spedizione'],
      errors:['Non controllare l’indirizzo di residenza','Confondere tessera sanitaria e carta d’identità','Aspettare se ti serve per una visita imminente']
    },
    {
      id:'tessera-elettorale', cat:'documenti', title:'Tessera elettorale smarrita', difficulty:'Facile', time:'30–60 minuti', online:false, free:true,
      summary:'Cosa preparare per richiedere un duplicato presso il Comune.',
      keywords:'tessera elettorale smarrita persa duplicato comune ufficio elettorale votare voto documento',
      docs:['Documento d’identità','Eventuale denuncia se richiesta dal Comune','Codice fiscale se richiesto'],
      steps:['Individua il Comune di residenza','Cerca orari dell’ufficio elettorale','Verifica se serve denuncia','Porta un documento valido','Richiedi il duplicato','Conserva la nuova tessera'],
      errors:['Andare nel Comune sbagliato','Non controllare gli orari speciali prima delle elezioni','Presentarsi senza documento']
    },
    {
      id:'mail-professore', cat:'scuola', title:'Scrivere una mail formale a un professore', difficulty:'Facile', time:'5–10 minuti', online:true, free:true,
      summary:'Struttura corretta: oggetto, saluto, motivo, richiesta, ringraziamento e firma.',
      keywords:'mail professore email formale scuola segreteria assenza recupero verifica registro elettronico',
      docs:['Nome professore','Classe','Motivo chiaro','Eventuali date o allegati'],
      steps:['Scrivi un oggetto preciso','Apri con un saluto formale','Spiega il problema in poche righe','Fai una richiesta chiara','Chiudi con ringraziamento e firma'],
      errors:['Oggetto vuoto','Tono troppo informale','Messaggio senza dati utili','Richiesta poco chiara']
    },
    {
      id:'maturita', cat:'scuola', title:'Organizzare lo studio per la maturità', difficulty:'Alta', time:'2–8 settimane', online:false, free:true,
      summary:'Metodo per dividere materie, collegamenti, simulazioni orali e checklist finale.',
      keywords:'maturità esame orale seconda prova collegamenti percorso ripasso calendario materie liceo',
      docs:['Programmi svolti','Materiali e appunti','Date delle prove','Griglie di valutazione se disponibili'],
      steps:['Elenca materie e argomenti','Dividi argomenti forti e deboli','Crea un calendario realistico','Alterna ripasso e simulazioni','Prepara collegamenti interdisciplinari','Fai prove orali cronometrate'],
      errors:['Studiare solo leggendo','Non simulare l’orale','Trascurare gli argomenti deboli','Non lasciare giorni di recupero']
    },
    {
      id:'visita-medica', cat:'salute', title:'Prenotare una visita medica', difficulty:'Facile', time:'15–40 minuti', online:true, free:false,
      summary:'Organizza impegnativa, CUP, documenti, domande da fare e promemoria.',
      keywords:'visita medica prenotare cup medico base impegnativa ricetta referto documenti asl',
      docs:['Documento d’identità','Tessera sanitaria','Impegnativa se necessaria','Referti precedenti','Lista farmaci'],
      steps:['Capire se serve medico di base o specialista','Recuperare l’impegnativa se richiesta','Prenotare tramite CUP o struttura privata','Salvare data, luogo e costo','Preparare documenti e domande','Portare referti precedenti'],
      errors:['Dimenticare l’impegnativa','Non portare referti vecchi','Non chiedere preparazioni specifiche','Confondere pronto soccorso e visita programmata']
    },
    {
      id:'cv', cat:'lavoro', title:'Creare un curriculum per il primo lavoro', difficulty:'Media', time:'30–90 minuti', online:true, free:true,
      summary:'Struttura chiara per esperienze, competenze, formazione e disponibilità.',
      keywords:'curriculum cv primo lavoro competenze esperienza stage colloquio lettera presentazione',
      docs:['Dati di contatto','Percorso scolastico','Esperienze','Competenze','Disponibilità oraria'],
      steps:['Scegli un formato pulito','Inserisci contatti professionali','Scrivi formazione ed esperienze','Aggiungi competenze concrete','Adatta il CV al ruolo','Esporta in PDF'],
      errors:['CV troppo lungo','Email non professionale','Competenze generiche senza esempi','Errori grammaticali']
    },
    {
      id:'prima-casa', cat:'casa', title:'Andare a vivere da soli: prima casa', difficulty:'Alta', time:'1–3 mesi', online:false, free:false,
      summary:'Budget, contratto, cauzione, utenze, residenza, spese nascoste ed emergenze domestiche.',
      keywords:'prima casa vivere da sola affitto contratto cauzione utenze residenza budget bollette trasloco',
      docs:['Documento d’identità','Codice fiscale','Buste paga/garanzie se richieste','Contratto di locazione','IBAN per pagamenti'],
      steps:['Calcola budget realistico','Valuta casa e zona','Leggi contratto e spese incluse','Organizza cauzione e prima mensilità','Attiva utenze e internet','Valuta cambio residenza','Prepara fondo emergenze'],
      errors:['Considerare solo l’affitto','Non leggere costi condominiali','Firmare senza capire clausole','Non fotografare lo stato iniziale della casa']
    },
    {
      id:'portafoglio', cat:'emergenze', title:'Ho perso il portafoglio', difficulty:'Urgente', time:'Subito', online:false, free:false,
      summary:'Azioni immediate: bloccare carte, capire quali documenti erano dentro, denuncia se necessaria, duplicati.',
      keywords:'portafoglio perso rubato smarrito carta identità patente tessera sanitaria bancomat bloccare carta denuncia',
      docs:['Lista carte/documenti presenti','Documento alternativo se disponibile','Numero banca','Eventuale denuncia'],
      steps:['Blocca subito carte bancarie','Verifica quali documenti erano nel portafoglio','Controlla movimenti sospetti','Fai denuncia se necessario','Richiedi duplicati','Salva numeri utili per il futuro'],
      errors:['Aspettare a bloccare le carte','Non controllare movimenti bancari','Dimenticare tessere secondarie','Non conservare copia della denuncia']
    },
    {
      id:'spid', cat:'documenti', title:'Come fare lo SPID', difficulty:'Media', time:'30 minuti–alcuni giorni', online:true, free:false,
      summary:'Scegli provider, prepara documento, codice fiscale, email, telefono e riconoscimento.',
      keywords:'spid identità digitale provider poste aruba namirial cie documento telefono email riconoscimento',
      docs:['Documento d’identità','Tessera sanitaria/codice fiscale','Email','Numero di telefono','Webcam o app se riconoscimento online'],
      steps:['Scegli un provider SPID','Crea account','Inserisci dati personali','Scegli metodo di riconoscimento','Completa verifica identità','Salva credenziali in modo sicuro'],
      errors:['Usare email non accessibile','Non controllare costi del riconoscimento','Perdere password o codici','Confondere SPID con CIE']
    },
    {
      id:'denuncia-smarrimento', cat:'emergenze', title:'Denuncia di smarrimento documenti', difficulty:'Media', time:'30–90 minuti', online:false, free:true,
      summary:'Quando serve, cosa dichiarare e cosa fare dopo la denuncia.',
      keywords:'denuncia smarrimento documenti carabinieri polizia carta identità patente portafoglio furto',
      docs:['Documento alternativo se disponibile','Elenco documenti smarriti','Luogo e data dello smarrimento','Eventuali prove o dettagli'],
      steps:['Ricostruisci cosa hai perso','Controlla se serve denuncia per il duplicato','Vai da Polizia/Carabinieri o usa servizi disponibili','Dichiara dettagli in modo preciso','Conserva copia','Avvia richieste duplicati'],
      errors:['Dichiarare dati imprecisi','Perdere la copia della denuncia','Non bloccare carte prima della denuncia in caso di furto']
    },
    {
      id:'tolc', cat:'universita', title:'Prepararsi al TOLC', difficulty:'Media', time:'2–6 settimane', online:true, free:false,
      summary:'Scelta del test, simulazioni, calendario e materiali da ripassare.',
      keywords:'tolc università test ingresso cisia iscrizione simulazione facoltà punteggio',
      docs:['Documento identità','Dati accesso piattaforma','Ricevuta iscrizione','Materiali di studio'],
      steps:['Verifica quale TOLC richiede il corso','Leggi bando del corso','Prenota il test','Dividi gli argomenti','Fai simulazioni a tempo','Controlla punteggio e scadenze'],
      errors:['Fare il TOLC sbagliato','Non leggere il bando','Studiare senza simulazioni','Dimenticare documento il giorno del test']
    }
  ],
  paths: [
    {
      id:'isee', title:'Devo fare l’ISEE', icon:'💶', desc:'Percorso per capire documenti, DSU, CAF o richiesta online.', guide:'isee',
      questions:[
        {key:'purpose',label:'A cosa ti serve?',type:'select',options:['Università','Bonus o agevolazione','Affitto/casa','Altro']},
        {key:'age',label:'Sei maggiorenne?',type:'select',options:['Sì','No']},
        {key:'spid',label:'Hai SPID o CIE?',type:'select',options:['Sì','No','Non lo so']},
        {key:'income',label:'Hai reddito o conto corrente intestato?',type:'select',options:['Sì','No','Non lo so']},
        {key:'deadline',label:'Hai una scadenza?',type:'date'}
      ]
    },
    {
      id:'interrogazione', title:'Devo preparare un’interrogazione', icon:'🎤', desc:'Piano di studio, domande possibili e simulazione orale.', guide:'maturita',
      questions:[
        {key:'subject',label:'Materia',type:'text',placeholder:'es. Filosofia'},
        {key:'topic',label:'Argomento',type:'text',placeholder:'es. Kant'},
        {key:'date',label:'Data interrogazione',type:'date'},
        {key:'level',label:'Livello attuale',type:'select',options:['Non ho iniziato','So qualcosa','Sono quasi pronta']},
        {key:'hours',label:'Ore disponibili al giorno',type:'number',min:1,max:8}
      ]
    },
    {
      id:'portafoglio', title:'Ho perso il portafoglio', icon:'🚨', desc:'Checklist urgente per bloccare carte e recuperare documenti.', guide:'portafoglio',
      questions:[
        {key:'cards',label:'C’erano carte bancarie?',type:'select',options:['Sì','No','Non lo so']},
        {key:'docs',label:'Quali documenti ricordi?',type:'text',placeholder:'es. carta identità, patente, tessera sanitaria'},
        {key:'theft',label:'Pensi sia furto?',type:'select',options:['Sì','No','Non lo so']},
        {key:'travel',label:'Ti serve un documento entro 48 ore?',type:'select',options:['Sì','No']}
      ]
    },
    {
      id:'prima-casa', title:'Voglio andare a vivere da sola', icon:'🏠', desc:'Budget, contratto, spese, utenze, residenza e borsa minima.', guide:'prima-casa',
      questions:[
        {key:'rent',label:'Affitto massimo mensile',type:'number',placeholder:'es. 600'},
        {key:'city',label:'Città/zona',type:'text',placeholder:'es. Roma'},
        {key:'income',label:'Entrate mensili stimate',type:'number',placeholder:'es. 1200'},
        {key:'alone',label:'Vivrai da sola o con coinquilini?',type:'select',options:['Da sola','Con coinquilini','Non lo so']}
      ]
    },
    {
      id:'visita', title:'Devo prenotare una visita medica', icon:'🩺', desc:'Documenti, domande per il medico e promemoria.', guide:'visita-medica',
      questions:[
        {key:'type',label:'Tipo di visita',type:'text',placeholder:'es. dermatologica'},
        {key:'prescription',label:'Hai impegnativa/ricetta?',type:'select',options:['Sì','No','Non so se serve']},
        {key:'date',label:'Hai una data preferita?',type:'date'},
        {key:'docs',label:'Hai referti precedenti?',type:'select',options:['Sì','No']}
      ]
    },
    {
      id:'colloquio', title:'Devo preparare un colloquio', icon:'💼', desc:'Domande simulate, punti forti e risposta modello.', guide:'cv',
      questions:[
        {key:'role',label:'Ruolo per cui ti candidi',type:'text',placeholder:'es. commessa'},
        {key:'experience',label:'Hai esperienza?',type:'select',options:['Sì','No','Poca']},
        {key:'strengths',label:'Punti forti',type:'text',placeholder:'es. puntualità, contatto con il pubblico'},
        {key:'date',label:'Data colloquio',type:'date'}
      ]
    }
  ],
  emergencyCards: [
    {id:'portafoglio',title:'Portafoglio perso',icon:'👛',now:['Blocca carte bancarie','Controlla quali documenti mancano','Verifica ultimi movimenti','Fai denuncia se furto o se richiesta per duplicati'],dont:['Non aspettare a bloccare le carte','Non pubblicare foto dei documenti online'],after:['Richiedi duplicati','Salva numeri utili','Conserva copia denuncia']},
    {id:'telefono',title:'Telefono rubato o perso',icon:'📱',now:['Blocca SIM dal gestore','Usa trova dispositivo se attivo','Cambia password principali','Blocca app bancarie'],dont:['Non ignorare accessi sospetti','Non usare lo stesso codice ovunque'],after:['Denuncia se furto','Ripristina backup','Attiva autenticazione a due fattori']},
    {id:'carta',title:'Carta bancaria persa',icon:'💳',now:['Chiama subito la banca','Blocca la carta dall’app se possibile','Controlla movimenti','Salva numero della pratica'],dont:['Non aspettare di vedere addebiti','Non condividere PIN o codici'],after:['Richiedi nuova carta','Contesta movimenti sospetti','Aggiorna abbonamenti collegati']},
    {id:'medica',title:'Problema medico urgente',icon:'🚑',now:['Valuta gravità','Chiama il numero di emergenza se c’è pericolo immediato','Contatta guardia medica o medico se non è emergenza','Prepara tessera sanitaria e farmaci assunti'],dont:['Non usare il sito per diagnosi','Non rimandare segnali gravi'],after:['Annota sintomi e orari','Porta referti','Chiedi istruzioni scritte']},
    {id:'casa',title:'Emergenza in casa',icon:'🏚️',now:['Metti in sicurezza persone e animali','Chiudi acqua/gas/elettricità solo se sicuro','Contatta tecnico o amministratore','Documenta con foto'],dont:['Non toccare fili scoperti','Non tentare riparazioni rischiose'],after:['Avvisa proprietario se sei in affitto','Conserva ricevute','Aggiorna assicurazione se presente']}
  ],
  generatorTypes: [
    'Email a professore','Email alla segreteria','Richiesta appuntamento','Reclamo formale','Comunicazione assenza','Messaggio per medico','Messaggio per datore di lavoro','Richiesta rimborso','Lettera motivazionale','Delega semplice'
  ],
  serviceTypes:['CAF','Patronato','Farmacia','ASL/CUP','Biblioteca','Comune/Municipio','Centro per l’impiego','Poste','Commissariato','Consultorio'],
  sampleDeadlines: [
    {title:'Controllare documenti ISEE',date:'',type:'Documenti',priority:'Media'},
    {title:'Ripasso verifica/interrogazione',date:'',type:'Scuola',priority:'Alta'}
  ]
};
