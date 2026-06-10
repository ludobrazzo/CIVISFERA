(function(){
  const D=()=>window.CIVI_DATA;
  const A=()=>window.Civisfera;
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>[...root.querySelectorAll(s)];

  function guideCard(g){
    const state=A().read();
    const fav=state.favorites.includes(g.id);
    return `<article class="card" data-guide-card="${g.id}">
      <div class="meta-row"><span class="pill">${A().esc(g.cat)}</span><span class="pill">${A().esc(g.difficulty)}</span><span class="pill">${A().esc(g.time)}</span></div>
      <h3>${A().esc(g.title)}</h3>
      <p class="muted">${A().esc(g.summary)}</p>
      <div class="meta-row"><span class="pill ${g.online?'green':'yellow'}">${g.online?'Online possibile':'Ufficio fisico'}</span><span class="pill ${g.free?'green':'yellow'}">${g.free?'Gratis':'Possibili costi'}</span></div>
      <div class="meta-row">
        <button class="btn small-btn" data-open-guide="${g.id}">Apri guida</button>
        <button class="btn secondary small-btn" data-save-guide="${g.id}">${fav?'★ Salvata':'☆ Salva'}</button>
      </div>
    </article>`;
  }

  function openGuide(id){
    const g=D().guides.find(x=>x.id===id); if(!g) return;
    const docs=g.docs.map(x=>`<li>${A().esc(x)}</li>`).join('');
    const steps=g.steps.map((x,i)=>`<div class="list-item"><b>${i+1}</b><span>${A().esc(x)}</span></div>`).join('');
    const errors=g.errors.map(x=>`<li>${A().esc(x)}</li>`).join('');
    A().openModal(`
      <p class="lead">${A().esc(g.summary)}</p>
      <div class="meta-row"><span class="pill">Difficoltà: ${A().esc(g.difficulty)}</span><span class="pill">Tempo: ${A().esc(g.time)}</span><span class="pill ${g.online?'green':'yellow'}">${g.online?'Online possibile':'Ufficio fisico'}</span><span class="pill ${g.free?'green':'yellow'}">${g.free?'Gratis':'Possibili costi'}</span></div>
      <div class="grid cols-2">
        <div class="card compact"><h3>Documenti/dati</h3><ul>${docs}</ul></div>
        <div class="card compact"><h3>Errori da evitare</h3><ul>${errors}</ul></div>
      </div>
      <h3>Procedura passo passo</h3><div class="list">${steps}</div>
      <div class="meta-row"><button class="btn" data-modal-checklist="${g.id}">Salva checklist</button><a class="btn secondary" href="percorso.html#${g.id}">Cerca percorso collegato</a></div>
    `,g.title);
    $('[data-modal-checklist]')?.addEventListener('click',()=>{A().saveChecklist(g.title,g.steps,g.title);A().toast('Checklist salvata in Area personale','success')});
  }

  function initHome(){
    const catEl=$('#categoryGrid');
    if(catEl){catEl.innerHTML=D().categories.map(c=>`<a class="card category-card" href="${c.page}"><div class="category-icon">${c.icon}</div><div><h3>${A().esc(c.title)}</h3><p class="small muted">${A().esc(c.desc)}</p></div></a>`).join('')}
    A().bindSearch($('#homeSearch'),$('#homeResults'));
    const popular=['isee','portafoglio','mail-professore','maturita','visita-medica','prima-casa'];
    const popEl=$('#popularGuides');
    if(popEl){popEl.innerHTML=popular.map(id=>D().guides.find(g=>g.id===id)).filter(Boolean).map(guideCard).join('')}
    const quick=$('#quickPaths');
    if(quick){quick.innerHTML=D().paths.slice(0,6).map(p=>`<a class="card" href="percorso.html#${p.id}"><div class="big-icon">${p.icon}</div><h3>${A().esc(p.title)}</h3><p class="muted">${A().esc(p.desc)}</p><span class="btn small-btn">Inizia percorso</span></a>`).join('')}
    const state=A().read();
    const scad=$('#homeDeadlines');
    if(scad){
      const rows=state.deadlines.sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')).slice(0,4);
      scad.innerHTML=rows.length?rows.map(deadlineRow).join(''):`<div class="card compact"><b>Nessuna scadenza salvata.</b><p class="small muted">Aggiungile dal calendario o dai percorsi guidati.</p><a class="btn small-btn" href="scadenze.html">Aggiungi scadenza</a></div>`;
    }
    $('#startUnknown')?.addEventListener('click',()=>openUnknownMode());
    bindGuideButtons();
  }

  function openUnknownMode(){
    const cats=D().categories.map(c=>`<option value="${c.id}">${c.title}</option>`).join('');
    A().openModal(`
      <form id="unknownForm" class="form-grid">
        <div class="form-field"><label>Che area riguarda?</label><select class="select" name="area">${cats}</select></div>
        <div class="form-field"><label>È urgente?</label><select class="select" name="urgent"><option>No</option><option>Sì</option></select></div>
        <div class="form-field"><label>Hai già provato qualcosa?</label><textarea class="textarea" name="tried" placeholder="Scrivi cosa hai già fatto"></textarea></div>
        <div class="form-field"><label>Hai una scadenza?</label><input class="input" name="date" type="date"></div>
        <button class="btn">Trova il percorso</button>
      </form>
      <div id="unknownOutput" class="section"></div>
    `,'Non so da dove iniziare');
    $('#unknownForm')?.addEventListener('submit',e=>{
      e.preventDefault(); const fd=Object.fromEntries(new FormData(e.target));
      const related=[...D().paths,...D().guides].filter(x=>(x.cat===fd.area)||(x.guide&&D().guides.find(g=>g.id===x.guide)?.cat===fd.area)).slice(0,4);
      $('#unknownOutput').innerHTML=`<div class="card"><h3>Percorsi consigliati</h3><p class="muted">${fd.urgent==='Sì'?'Parti dalle azioni immediate e dalle emergenze.':'Parti dal percorso guidato più vicino al problema.'}</p><div class="list">${related.map(r=>`<a class="list-item" href="${r.questions?'percorso.html#'+r.id:'guide.html#'+r.id}"><b>${A().esc(r.title)}</b><span class="muted small">${A().esc(r.desc||r.summary||'')}</span></a>`).join('')}</div>${fd.date?`<button class="btn small-btn" id="saveUnknownDeadline">Salva scadenza ${A().formatDate(fd.date)}</button>`:''}</div>`;
      $('#saveUnknownDeadline')?.addEventListener('click',()=>{A().saveDeadline({title:'Scadenza pratica: '+(D().categories.find(c=>c.id===fd.area)?.title||fd.area),date:fd.date,type:'Pratica',priority:fd.urgent==='Sì'?'Alta':'Media',notes:fd.tried});A().toast('Scadenza salvata','success')});
    });
  }

  function bindGuideButtons(root=document){
    $$('[data-open-guide]',root).forEach(b=>b.addEventListener('click',()=>openGuide(b.dataset.openGuide)));
    $$('[data-save-guide]',root).forEach(b=>b.addEventListener('click',()=>{A().toggleFavorite(b.dataset.saveGuide);A().toast('Preferiti aggiornati','success'); const page=document.body.dataset.page; if(page==='guide') initGuides(); if(page==='home') initHome();}));
  }

  function initGuides(){
    const grid=$('#guideGrid'); if(!grid) return;
    const cats=['tutte',...new Set(D().guides.map(g=>g.cat))];
    const catParam=A().getParam('cat')||'tutte';
    $('#guideTabs').innerHTML=cats.map(c=>`<button class="tab ${c===catParam?'active':''}" data-cat="${c}">${c==='tutte'?'Tutte':c}</button>`).join('');
    function render(cat=catParam,q=''){
      const filtered=D().guides.filter(g=>(cat==='tutte'||g.cat===cat)&&(!q||A().searchAll(q).some(r=>r.id===g.id&&r.type==='Guida')));
      grid.innerHTML=filtered.length?filtered.map(guideCard).join(''):`<div class="card"><b>Nessuna guida trovata.</b></div>`;
      bindGuideButtons(grid);
    }
    render(catParam);
    $$('#guideTabs .tab').forEach(t=>t.addEventListener('click',()=>{ $$('#guideTabs .tab').forEach(x=>x.classList.remove('active')); t.classList.add('active'); render(t.dataset.cat,$('#guideSearch').value.trim()) }));
    $('#guideSearch')?.addEventListener('input',e=>render($('.tab.active')?.dataset.cat||'tutte',e.target.value.trim()));
    if(location.hash){setTimeout(()=>openGuide(location.hash.slice(1)),200)}
  }

  function initPercorsi(){
    const list=$('#pathList'); const runner=$('#pathRunner'); if(!list||!runner) return;
    list.innerHTML=D().paths.map(p=>`<button class="card" data-start-path="${p.id}"><div class="big-icon">${p.icon}</div><h3>${A().esc(p.title)}</h3><p class="muted">${A().esc(p.desc)}</p></button>`).join('');
    function start(id){
      const p=D().paths.find(x=>x.id===id); if(!p) return;
      list.classList.add('hidden'); runner.classList.remove('hidden');
      runner.innerHTML=`<div class="card"><div class="meta-row"><button class="btn secondary small-btn" id="backPaths">← Tutti i percorsi</button><span class="pill">${p.icon} ${A().esc(p.title)}</span></div><h2>${A().esc(p.title)}</h2><p class="muted">Rispondi e genera una checklist personalizzata.</p><form id="pathForm" class="form-grid two">${p.questions.map(q=>fieldHTML(q)).join('')}<div class="form-field"><button class="btn">Genera percorso</button></div></form><div id="pathOutput" class="section"></div></div>`;
      $('#backPaths').addEventListener('click',()=>{runner.classList.add('hidden'); list.classList.remove('hidden'); history.replaceState(null,'','percorso.html')});
      $('#pathForm').addEventListener('submit',e=>{e.preventDefault();generatePath(p,Object.fromEntries(new FormData(e.target)))});
      history.replaceState(null,'',`#${id}`);
    }
    $$('[data-start-path]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.startPath)));
    if(location.hash){start(location.hash.slice(1))}
  }

  function fieldHTML(q){
    const label=`<label>${A().esc(q.label)}</label>`;
    if(q.type==='select') return `<div class="form-field">${label}<select class="select" name="${q.key}">${q.options.map(o=>`<option>${A().esc(o)}</option>`).join('')}</select></div>`;
    return `<div class="form-field">${label}<input class="input" name="${q.key}" type="${q.type}" ${q.placeholder?`placeholder="${A().esc(q.placeholder)}"`:''} ${q.min?`min="${q.min}"`:''} ${q.max?`max="${q.max}"`:''}></div>`;
  }

  function generatePath(p,answers){
    const guide=D().guides.find(g=>g.id===p.guide);
    let items=[...(guide?.steps||[])];
    let warnings=[];
    let plan=[];
    if(p.id==='isee'){
      if(answers.spid!=='Sì') items.unshift('Attiva SPID/CIE oppure prenota un CAF/patronato');
      if(answers.purpose==='Università') items.push('Controlla sul portale universitario entro quando caricare l’ISEE universitario');
      if(answers.income==='Sì') items.push('Recupera saldo e giacenza media di conti, carte e libretti');
      if(answers.deadline) warnings.push(`Scadenza indicata: ${A().formatDate(answers.deadline)}.`);
    }
    if(p.id==='interrogazione'){
      const topic=answers.topic||'argomento'; const subject=answers.subject||'materia';
      items=[`Raccogli appunti e programma su ${topic}`,`Fai un riassunto di ${subject} in massimo una pagina`,`Prepara 10 domande possibili`,`Ripeti ad alta voce senza leggere`,`Fai una simulazione orale cronometrata`,`Scrivi 5 collegamenti con altri argomenti`,`Ripassa solo errori e punti deboli il giorno prima`];
      plan=[`Giorno 1: comprensione e riassunto`, `Giorno 2: domande e mappe`, `Giorno 3: simulazione orale e correzione`];
      if(answers.level==='Non ho iniziato') warnings.push('Parti dai concetti base: non fare subito riassunti lunghi.');
    }
    if(p.id==='portafoglio'){
      items=['Blocca subito carte bancarie e app di pagamento','Scrivi elenco dei documenti presenti','Controlla movimenti bancari recenti','Fai denuncia se pensi a furto o se richiesta per duplicati','Richiedi duplicato dei documenti mancanti','Salva copia denuncia e numeri pratica'];
      if(answers.cards==='Sì') warnings.push('Le carte bancarie sono priorità immediata.');
      if(answers.travel==='Sì') items.unshift('Contatta subito Comune/ufficio competente per urgenza documento');
    }
    if(p.id==='prima-casa'){
      const rent=Number(answers.rent||0), income=Number(answers.income||0);
      items=['Calcola affitto + bollette + internet + cibo + trasporti','Prepara cauzione e prima mensilità','Leggi contratto prima di firmare','Controlla spese condominiali','Fotografa la casa all’ingresso','Attiva utenze e internet','Valuta cambio residenza o domicilio','Crea fondo emergenze'];
      if(rent&&income&&rent>income*0.4) warnings.push('Affitto superiore al 40% delle entrate: budget potenzialmente rischioso.');
    }
    if(p.id==='visita'){
      items=[`Verifica se per ${answers.type||'questa visita'} serve impegnativa`,`Prenota tramite CUP, medico o struttura`,`Salva data, indirizzo, costo e codice prenotazione`,`Prepara tessera sanitaria e documento`,`Porta referti precedenti`,`Scrivi sintomi, farmaci e domande da fare`,`Chiedi cosa fare dopo la visita`];
      if(answers.prescription!=='Sì') warnings.push('Controlla prima se serve impegnativa: senza, potresti non riuscire a prenotare nel pubblico.');
    }
    if(p.id==='colloquio'){
      items=[`Studia l’azienda e il ruolo: ${answers.role||'ruolo scelto'}`,`Prepara risposta “Parlami di te” in 60 secondi`,`Scrivi 3 punti forti con esempi concreti`,`Prepara una difficoltà superata`,`Prepara 2 domande da fare al selezionatore`,`Scegli abbigliamento e percorso per arrivare puntuale`,`Fai una simulazione a voce`];
      if(answers.experience==='No') warnings.push('Punta su motivazione, disponibilità, affidabilità e capacità di imparare.');
    }
    const output=$('#pathOutput');
    output.innerHTML=`<div class="grid cols-2"><div class="card"><h3>Checklist personalizzata</h3><div class="checklist">${items.map((x,i)=>`<label class="check-row"><input type="checkbox"><span>${A().esc(x)}</span></label>`).join('')}</div><div class="meta-row"><button class="btn" id="savePathChecklist">Salva checklist</button>${answers.deadline||answers.date?`<button class="btn secondary" id="savePathDeadline">Salva scadenza</button>`:''}</div></div><div class="card"><h3>Avvisi e piano</h3>${warnings.length?warnings.map(w=>`<p class="warning">⚠️ ${A().esc(w)}</p>`).join(''):'<p class="success">Nessun avviso specifico dai dati inseriti.</p>'}${plan.length?`<h3>Piano rapido</h3><ul>${plan.map(x=>`<li>${A().esc(x)}</li>`).join('')}</ul>`:''}<h3>Guida collegata</h3><p class="muted">${guide?A().esc(guide.summary):'Nessuna guida collegata.'}</p>${guide?`<button class="btn ghost" data-open-guide="${guide.id}">Apri guida completa</button>`:''}</div></div>`;
    $$('.check-row input',output).forEach(input=>input.addEventListener('change',()=>input.closest('.check-row').classList.toggle('done',input.checked)));
    $('#savePathChecklist')?.addEventListener('click',()=>{A().saveChecklist(p.title,items,p.title); A().patch(s=>s.paths.unshift({id:A().uid('path'),title:p.title,answers,createdAt:new Date().toISOString()})); A().toast('Percorso salvato','success')});
    $('#savePathDeadline')?.addEventListener('click',()=>{const date=answers.deadline||answers.date; A().saveDeadline({title:p.title,date,type:'Percorso',priority:warnings.length?'Alta':'Media',notes:Object.entries(answers).map(([k,v])=>`${k}: ${v}`).join('\n')});A().toast('Scadenza salvata','success')});
    bindGuideButtons(output);
  }

  function deadlineRow(d){
    const n=A().daysUntil(d.date);
    const label=n===null?'Senza data':n<0?`${Math.abs(n)} giorni fa`:n===0?'Oggi':`Tra ${n} giorni`;
    return `<div class="list-item"><div><span class="pill ${A().priorityClass(d.priority)}">${A().esc(d.priority||'Media')}</span></div><div><b>${A().esc(d.title)}</b><div class="small muted">${A().formatDate(d.date)} · ${label} · ${A().esc(d.type||'Generale')}</div>${d.notes?`<div class="small muted">${A().esc(d.notes).slice(0,120)}</div>`:''}</div></div>`;
  }

  function initScadenze(){
    const form=$('#deadlineForm'); const list=$('#deadlineList'); if(!form||!list) return;
    function render(){
      const state=A().read();
      const rows=[...state.deadlines].sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'));
      list.innerHTML=rows.length?rows.map(d=>`<div class="card compact"><div class="section-head"><div>${deadlineRow(d)}</div><button class="btn danger small-btn" data-del-deadline="${d.id}">Elimina</button></div></div>`).join(''):`<div class="card"><b>Nessuna scadenza.</b><p class="muted">Aggiungi verifiche, appuntamenti, pagamenti o pratiche.</p></div>`;
      $$('[data-del-deadline]').forEach(b=>b.addEventListener('click',()=>{A().patch(s=>s.deadlines=s.deadlines.filter(x=>x.id!==b.dataset.delDeadline));render();A().toast('Scadenza eliminata')}));
    }
    form.addEventListener('submit',e=>{e.preventDefault(); const fd=Object.fromEntries(new FormData(form)); A().saveDeadline(fd); form.reset(); render(); A().toast('Scadenza salvata','success')});
    $('#seedDeadlines')?.addEventListener('click',()=>{const tomorrow=new Date(); tomorrow.setDate(tomorrow.getDate()+7); A().saveDeadline({title:'Controllare pratica importante',date:tomorrow.toISOString().slice(0,10),type:'Organizzazione',priority:'Media',notes:'Scadenza demo modificabile.'}); render()});
    render();
  }

  function initDashboard(){
    const state=A().read();
    $('#dashName') && ($('#dashName').textContent=state.user?.name||'Ospite');
    $('#dashStats') && ($('#dashStats').innerHTML=`<div class="card"><h3>${state.checklists.length}</h3><p class="muted">Checklist salvate</p></div><div class="card"><h3>${state.deadlines.length}</h3><p class="muted">Scadenze</p></div><div class="card"><h3>${state.documents.length}</h3><p class="muted">Documenti locali</p></div><div class="card"><h3>${state.messages.length}</h3><p class="muted">Testi generati</p></div>`);
    const lists=$('#dashChecklists');
    if(lists){lists.innerHTML=state.checklists.length?state.checklists.slice(0,5).map(c=>`<div class="card compact"><div class="section-head"><div><h3>${A().esc(c.title)}</h3><p class="small muted">${new Date(c.createdAt).toLocaleString('it-IT')}</p></div><button class="btn danger small-btn" data-del-check="${c.id}">Elimina</button></div><div class="progress"><span style="width:${progress(c)}%"></span></div><div class="checklist">${c.items.map((it,i)=>`<label class="check-row ${it.done?'done':''}"><input type="checkbox" ${it.done?'checked':''} data-check-toggle="${c.id}" data-index="${i}"><span>${A().esc(it.text)}</span></label>`).join('')}</div></div>`).join(''):`<div class="card">Nessuna checklist salvata.</div>`}
    $$('#dashChecklists [data-check-toggle]').forEach(ch=>ch.addEventListener('change',()=>{A().patch(s=>{const c=s.checklists.find(x=>x.id===ch.dataset.checkToggle); if(c)c.items[Number(ch.dataset.index)].done=ch.checked});initDashboard()}));
    $$('[data-del-check]').forEach(b=>b.addEventListener('click',()=>{A().patch(s=>s.checklists=s.checklists.filter(x=>x.id!==b.dataset.delCheck));initDashboard()}));
    $('#dashDeadlines') && ($('#dashDeadlines').innerHTML=state.deadlines.length?state.deadlines.sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')).slice(0,5).map(deadlineRow).join(''):`<div class="card">Nessuna scadenza salvata.</div>`);
    $('#dashMessages') && ($('#dashMessages').innerHTML=state.messages.length?state.messages.slice(0,4).map(m=>`<div class="card compact"><b>${A().esc(m.title)}</b><p class="small muted">${A().esc(m.type)} · ${new Date(m.createdAt).toLocaleString('it-IT')}</p><pre class="output-box">${A().esc(m.body).slice(0,700)}</pre></div>`).join(''):`<div class="card">Nessun testo generato.</div>`);
  }
  function progress(c){const total=c.items.length||1; const done=c.items.filter(x=>x.done).length; return Math.round(done/total*100)}

  function initGeneratori(){
    const type=$('#genType'); if(type) type.innerHTML=D().generatorTypes.map(x=>`<option>${A().esc(x)}</option>`).join('');
    $('#messageForm')?.addEventListener('submit',e=>{
      e.preventDefault(); const fd=Object.fromEntries(new FormData(e.target)); const out=buildMessage(fd); $('#messageOutput').textContent=out; A().saveMessage(fd.type,fd.type,out); A().toast('Testo generato e salvato','success');
    });
    $('#bureauForm')?.addEventListener('submit',e=>{
      e.preventDefault(); const text=new FormData(e.target).get('text'); const out=translateBureau(text); $('#bureauOutput').innerHTML=out; $('#saveBureauChecklist')?.addEventListener('click',()=>{A().saveChecklist('Traduttore burocratico',['Individua la scadenza','Trova quali documenti allegare','Controlla dove inviare la richiesta','Salva ricevuta o protocollo','Chiedi chiarimenti se manca un dato'],'Traduttore burocratico');A().toast('Checklist salvata','success')});
    });
    $('#copyMessage')?.addEventListener('click',()=>navigator.clipboard?.writeText($('#messageOutput').textContent||''));
  }
  function buildMessage(fd){
    const tone=fd.tone||'formale';
    const urgency=fd.urgency==='Alta'?'La richiesta ha carattere urgente.':'';
    const name=fd.name||'[Nome e cognome]';
    const details=fd.details||'[dettagli da inserire]';
    return `Oggetto: ${fd.subject||fd.type}\n\nGentile ${fd.recipient||'[Destinatario]'},\n\nmi chiamo ${name} e scrivo per ${details}.\n${urgency ? '\n'+urgency+'\n' : ''}\nResto disponibile per fornire eventuali informazioni aggiuntive e chiedo gentilmente un riscontro.\n\nCordiali saluti,\n${name}`;
  }
  function translateBureau(text=''){
    const lines=[];
    const t=text.toLowerCase();
    if(t.includes('termine perentorio')) lines.push(['Termine perentorio','Devi rispettare quella data: se invii dopo, la domanda può non essere accettata.']);
    if(t.includes('istanza')) lines.push(['Istanza','Significa richiesta o domanda formale.']);
    if(t.includes('allegare')) lines.push(['Allegare','Devi aggiungere uno o più documenti alla richiesta.']);
    if(t.includes('decadenza')) lines.push(['Decadenza','Potresti perdere il diritto o la possibilità di fare quella pratica.']);
    if(t.includes('autocertificazione')) lines.push(['Autocertificazione','Dichiari tu un dato sotto la tua responsabilità, senza certificato esterno.']);
    const checklist=['Individua la scadenza','Trova quali documenti allegare','Controlla dove inviare la richiesta','Salva ricevuta o protocollo','Chiedi chiarimenti se manca un dato'];
    return `<div class="card"><h3>Spiegazione semplice</h3><p>${A().esc(text||'Incolla un testo per ottenere la traduzione.')}</p>${lines.length?`<h3>Parole difficili</h3><div class="list">${lines.map(([a,b])=>`<div class="list-item"><b>${A().esc(a)}</b><span>${A().esc(b)}</span></div>`).join('')}</div>`:'<p class="muted">Non ho riconosciuto termini specifici: controlla comunque scadenze, documenti e destinatario.</p>'}<h3>Cosa fare</h3><div class="checklist">${checklist.map(x=>`<label class="check-row"><input type="checkbox"><span>${x}</span></label>`).join('')}</div><button class="btn small-btn" id="saveBureauChecklist">Salva checklist</button></div>`;
  }

  function initDocumenti(){
    const docs=$('#docList'); const form=$('#docForm'); if(!docs||!form) return;
    function render(){
      const state=A().read();
      docs.innerHTML=state.documents.length?state.documents.map(d=>`<div class="card compact"><div class="section-head"><div><h3>${A().esc(d.title)}</h3><p class="small muted">${A().esc(d.type)} · ${A().esc(d.filename||'senza file')} · ${new Date(d.createdAt).toLocaleString('it-IT')}</p><p class="small muted">${A().esc(d.notes||'')}</p></div><button class="btn danger small-btn" data-del-doc="${d.id}">Elimina</button></div></div>`).join(''):`<div class="card"><b>Nessun documento salvato.</b><p class="muted">In questa versione i file restano nel browser. Non caricare dati sensibili su computer condivisi.</p></div>`;
      $$('[data-del-doc]').forEach(b=>b.addEventListener('click',()=>{A().patch(s=>s.documents=s.documents.filter(x=>x.id!==b.dataset.delDoc));render()}));
    }
    form.addEventListener('submit',e=>{e.preventDefault(); const fd=Object.fromEntries(new FormData(form)); const file=$('#docFile').files[0]; A().patch(s=>s.documents.unshift({id:A().uid('doc'),title:fd.title,type:fd.type,notes:fd.notes,filename:file?.name||'',createdAt:new Date().toISOString()})); form.reset(); render(); A().toast('Documento registrato localmente','success')});
    $('#bagForm')?.addEventListener('submit',e=>{e.preventDefault(); const fd=Object.fromEntries(new FormData(e.target)); const items=bagItems(fd.kind); $('#bagOutput').innerHTML=`<div class="card"><h3>Borsa per ${A().esc(fd.kind)}</h3><div class="checklist">${items.map(x=>`<label class="check-row"><input type="checkbox"><span>${A().esc(x)}</span></label>`).join('')}</div><button class="btn small-btn" id="saveBag">Salva checklist</button></div>`; $('#saveBag').addEventListener('click',()=>{A().saveChecklist('Prepara la borsa: '+fd.kind,items,'Prepara la borsa');A().toast('Checklist salvata','success')})});
    render();
  }
  function bagItems(kind){
    const base=['Documento d’identità','Codice fiscale/tessera sanitaria','Telefono carico','Penna','Copia appuntamento o ricevuta'];
    const map={
      'CAF/ISEE':['Saldo e giacenza media','Redditi/patrimoni','Contratto d’affitto se presente','Documenti familiari'],
      'Visita medica':['Impegnativa se richiesta','Referti precedenti','Lista farmaci','Domande da fare al medico'],
      'Comune/documenti':['Foto tessera se richiesta','Denuncia se smarrimento','Vecchio documento se disponibile'],
      'Colloquio':['CV stampato','Indirizzo e nome referente','Domande da fare','Abbigliamento ordinato'],
      'Scuola/università':['Libretto o credenziali','Materiali richiesti','Modulo firmato se richiesto']
    };
    return [...base,...(map[kind]||[])];
  }

  function initStudio(){
    $('#studyForm')?.addEventListener('submit',e=>{e.preventDefault(); const fd=Object.fromEntries(new FormData(e.target)); const days=makeStudyPlan(fd); $('#studyOutput').innerHTML=`<div class="card"><h3>Piano studio</h3><div class="list">${days.map((d,i)=>`<div class="list-item"><b>Giorno ${i+1}</b><span>${A().esc(d)}</span></div>`).join('')}</div><button class="btn small-btn" id="saveStudy">Salva checklist</button></div>`; $('#saveStudy').addEventListener('click',()=>{A().saveChecklist('Studio: '+(fd.topic||fd.subject),days,'Scuola');A().toast('Piano salvato','success')})});
    $('#quizForm')?.addEventListener('submit',e=>{e.preventDefault(); const fd=Object.fromEntries(new FormData(e.target)); const qs=quizQuestions(fd); $('#quizOutput').innerHTML=`<div class="card"><h3>Interrogami: ${A().esc(fd.topic||'argomento')}</h3>${qs.map((q,i)=>`<details class="card compact"><summary><b>${i+1}. ${A().esc(q.q)}</b></summary><p>${A().esc(q.a)}</p></details>`).join('')}</div>`});
  }
  function makeStudyPlan(fd){
    const subject=fd.subject||'materia', topic=fd.topic||'argomento', days=Math.max(1,Number(fd.days||3));
    const base=[`Leggi e dividi ${topic} in sottoargomenti`,`Crea riassunto breve di ${subject}`,`Fai mappa concettuale e parole chiave`,`Rispondi a domande possibili`,`Ripeti ad alta voce senza guardare`,`Simula interrogazione e correggi errori`,`Ripasso finale solo sui punti deboli`];
    return Array.from({length:days},(_,i)=>base[i%base.length]);
  }
  function quizQuestions(fd){
    const t=fd.topic||'questo argomento';
    return [
      {q:`Spiega ${t} con parole semplici.`,a:'Risposta modello: definisci il concetto, colloca il periodo o il contesto, poi fai un esempio.'},
      {q:`Quali sono i concetti chiave di ${t}?`,a:'Elenca 3–5 parole chiave e spiega ciascuna in una frase.'},
      {q:`Quale collegamento puoi fare con un altro argomento?`,a:'Scegli un collegamento reale: causa, confronto, periodo storico, autore, applicazione pratica.'},
      {q:'Quale errore devi evitare?',a:'Non ripetere frasi a memoria senza spiegare il significato.'}
    ];
  }

  function initLavoro(){
    $('#cvForm')?.addEventListener('submit',e=>{e.preventDefault(); const fd=Object.fromEntries(new FormData(e.target)); const cv=`${fd.name||'[Nome]'}
${fd.email||'[Email]'}

OBIETTIVO
Cerco un’opportunità come ${fd.role||'[ruolo]'}. Sono una persona affidabile, puntuale e motivata a imparare.

FORMAZIONE
${fd.education||'[percorso scolastico]'}

ESPERIENZE
${fd.experience||'Prime esperienze / attività scolastiche / volontariato'}

COMPETENZE
${fd.skills||'organizzazione, comunicazione, lavoro in gruppo'}

DISPONIBILITÀ
${fd.availability||'[giorni e orari]'}`; $('#cvOutput').textContent=cv; A().saveMessage('CV','Curriculum '+(fd.name||''),cv); A().toast('CV salvato nei testi generati','success')});
    $('#interviewForm')?.addEventListener('submit',e=>{e.preventDefault(); const fd=Object.fromEntries(new FormData(e.target)); $('#interviewOutput').innerHTML=`<div class="card"><h3>Colloquio simulato</h3>${['Parlami di te','Perché vuoi questo lavoro?','Quali sono i tuoi punti di forza?','Racconta una difficoltà che hai gestito','Hai domande per noi?'].map(q=>`<details class="card compact"><summary><b>${q}</b></summary><p class="muted">Rispondi collegando la risposta al ruolo: ${A().esc(fd.role||'ruolo scelto')}. Usa esempi concreti, non frasi generiche.</p></details>`).join('')}</div>`});
  }

  function initSalute(){
    $('#healthForm')?.addEventListener('submit',e=>{e.preventDefault(); const fd=Object.fromEntries(new FormData(e.target)); const questions=['Quale potrebbe essere la causa più probabile?','Quali segnali dovrebbero farmi tornare o chiedere aiuto subito?','Serve una visita specialistica o un controllo?','Ci sono farmaci, attività o alimenti da evitare?','Quando devo fare il prossimo controllo?']; $('#healthOutput').innerHTML=`<div class="card"><h3>Promemoria visita</h3><p class="warning">Questo strumento non fa diagnosi. Per sintomi gravi o improvvisi contatta un medico o i servizi di emergenza.</p><h3>Domande da fare</h3><ul>${questions.map(q=>`<li>${q}</li>`).join('')}</ul><h3>Note sintomi</h3><p>${A().esc(fd.symptoms||'')}</p><button class="btn small-btn" id="saveHealthChecklist">Salva checklist</button></div>`; $('#saveHealthChecklist').addEventListener('click',()=>{A().saveChecklist('Visita medica',questions,'Salute');A().toast('Checklist salvata','success')})});
  }

  function initEmergenze(){
    const grid=$('#emergencyGrid'); if(!grid) return;
    grid.innerHTML=D().emergencyCards.map(c=>`<article class="card"><div class="big-icon">${c.icon}</div><h3>${A().esc(c.title)}</h3><h4>Cosa fare subito</h4><ol>${c.now.map(x=>`<li>${A().esc(x)}</li>`).join('')}</ol><h4>Cosa non fare</h4><ul>${c.dont.map(x=>`<li>${A().esc(x)}</li>`).join('')}</ul><div class="meta-row"><button class="btn small-btn" data-save-emergency="${c.id}">Salva checklist</button></div></article>`).join('');
    $$('[data-save-emergency]').forEach(b=>b.addEventListener('click',()=>{const c=D().emergencyCards.find(x=>x.id===b.dataset.saveEmergency); A().saveChecklist('Emergenza: '+c.title,[...c.now,...c.after],c.title);A().toast('Checklist emergenza salvata','success')}));
  }


  function initServizi(){
    const type=$('#serviceType');
    if(type) type.innerHTML=D().serviceTypes.map(x=>`<option>${A().esc(x)}</option>`).join('');
    $('#serviceForm')?.addEventListener('submit',e=>{
      e.preventDefault();
      const fd=Object.fromEntries(new FormData(e.target));
      const query=encodeURIComponent(`${fd.type} ${fd.city}`);
      const url=`https://www.google.com/maps/search/?api=1&query=${query}`;
      $('#serviceOutput').innerHTML=`<div class="card"><h3>Ricerca pronta</h3><p class="muted">Apre una ricerca mappe per: <b>${A().esc(fd.type)}</b> in <b>${A().esc(fd.city||'zona indicata')}</b>.</p><a class="btn" target="_blank" rel="noopener" href="${url}">Apri sulla mappa</a><div class="list"><div class="list-item">🔎 <span>Controlla orari ufficiali prima di andare.</span></div><div class="list-item">📞 <span>Chiama se devi confermare documenti o appuntamento.</span></div><div class="list-item">♿ <span>Verifica accessibilità, costi e servizio online.</span></div></div></div>`;
    });
    $('#geoService')?.addEventListener('click',()=>{
      if(!navigator.geolocation){A().toast('Geolocalizzazione non supportata','danger');return}
      navigator.geolocation.getCurrentPosition(pos=>{
        const type=$('#serviceType')?.value||'CAF';
        const url=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(type)}&center=${pos.coords.latitude},${pos.coords.longitude}`;
        $('#serviceOutput').innerHTML=`<div class="card"><h3>Ricerca vicino a te</h3><a class="btn" target="_blank" rel="noopener" href="${url}">Apri servizi vicini</a><p class="small muted">La posizione viene usata solo dal browser per aprire la ricerca esterna.</p></div>`;
      },()=>A().toast('Permesso posizione negato','danger'));
    });
  }

  function initProfilo(){
    const state=A().read();
    $('#loginName') && ($('#loginName').value=state.user?.name||'');
    $('#loginEmail') && ($('#loginEmail').value=state.user?.email||'');
    $('#roleSelect') && ($('#roleSelect').value=state.settings.role||'Studente');
    $('#largeText') && ($('#largeText').checked=!!state.settings.largeText);
    $('#highContrast') && ($('#highContrast').checked=!!state.settings.highContrast);
    $('#focusMode') && ($('#focusMode').checked=!!state.settings.focusMode);
    $('#profileStatus') && ($('#profileStatus').innerHTML=state.user?`Accesso demo come <b>${A().esc(state.user.name)}</b>`:'Modalità ospite');
    $('#profileForm')?.addEventListener('submit',e=>{e.preventDefault(); const fd=Object.fromEntries(new FormData(e.target)); A().patch(s=>{s.user={name:fd.name||'Utente',email:fd.email||''}}); A().toast('Profilo salvato','success'); initProfilo()});
    $('#settingsForm')?.addEventListener('change',()=>{A().patch(s=>{s.settings={role:$('#roleSelect').value,largeText:$('#largeText').checked,highContrast:$('#highContrast').checked,focusMode:$('#focusMode').checked}}); A().toast('Impostazioni aggiornate','success')});
    $('#exportData')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(A().read(),null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='civisfera-dati.json'; a.click(); URL.revokeObjectURL(a.href)});
    $('#importData')?.addEventListener('change',e=>{const file=e.target.files[0]; if(!file)return; const reader=new FileReader(); reader.onload=()=>{try{A().write(JSON.parse(reader.result)); A().toast('Dati importati','success'); location.reload()}catch(err){A().toast('File non valido','danger')}}; reader.readAsText(file)});
    $('#clearData')?.addEventListener('click',()=>{if(confirm('Eliminare tutti i dati locali?')){localStorage.removeItem('civisfera_state_v1'); location.reload()}});
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const page=document.body.dataset.page;
    const map={home:initHome,guide:initGuides,percorso:initPercorsi,dashboard:initDashboard,scadenze:initScadenze,generatori:initGeneratori,documenti:initDocumenti,studio:initStudio,lavoro:initLavoro,salute:initSalute,emergenze:initEmergenze,servizi:initServizi,profilo:initProfilo};
    map[page]?.();
    document.addEventListener('click',e=>{const row=e.target.closest('.check-row'); if(row&&e.target.matches('input[type="checkbox"]')) row.classList.toggle('done',e.target.checked)});
  });
})();
