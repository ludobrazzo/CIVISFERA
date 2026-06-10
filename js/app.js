(function(){
  const KEY='civisfera_state_v1';
  const defaultState={
    user:null,
    settings:{role:'Studente',largeText:false,highContrast:false,focusMode:false},
    checklists:[],deadlines:[],documents:[],messages:[],notes:[],favorites:[],paths:[],community:[]
  };

  function uid(prefix='id'){return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2,8)}`}
  function todayISO(){return new Date().toISOString().slice(0,10)}
  function esc(str=''){
    return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  function read(){
    try{return {...defaultState,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return structuredClone(defaultState)}
  }
  function write(state){localStorage.setItem(KEY,JSON.stringify(state)); applySettings(state.settings); return state}
  function patch(fn){const state=read(); fn(state); return write(state)}
  function getParam(name){return new URLSearchParams(location.search).get(name)}
  function formatDate(value){
    if(!value) return 'Senza data';
    const d=new Date(value+'T00:00:00');
    if(Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('it-IT',{day:'2-digit',month:'long',year:'numeric'});
  }
  function daysUntil(value){
    if(!value) return null;
    const start=new Date(todayISO());
    const end=new Date(value+'T00:00:00');
    return Math.ceil((end-start)/(1000*60*60*24));
  }
  function priorityClass(p){return p==='Alta'?'red':p==='Media'?'yellow':'green'}

  function toast(text,type='info'){
    let wrap=document.querySelector('.toast-wrap');
    if(!wrap){wrap=document.createElement('div');wrap.className='toast-wrap';document.body.appendChild(wrap)}
    const el=document.createElement('div'); el.className=`toast ${type}`; el.textContent=text; wrap.appendChild(el);
    setTimeout(()=>{el.style.opacity='0'; el.style.transform='translateY(8px)'; setTimeout(()=>el.remove(),250)},3200);
  }

  function applySettings(settings={}){
    document.body.classList.toggle('large-text',!!settings.largeText);
    document.body.classList.toggle('high-contrast',!!settings.highContrast);
    document.body.classList.toggle('focus-mode',!!settings.focusMode);
    document.body.classList.toggle('senior-mode',settings.role==='Anziano');
  }

  function renderHeader(){
    const current=location.pathname.split('/').pop()||'index.html';
    const nav=(window.CIVI_DATA?.nav||[]).map(([href,label])=>`<a href="${href}" class="${current===href?'active':''}">${label}</a>`).join('');
    const header=document.createElement('header'); header.className='site-header';
    header.innerHTML=`
      <a href="#main" class="skip-link">Vai al contenuto</a>
      <div class="navbar">
        <a class="brand" href="index.html" aria-label="Civisfera home"><span class="brand-mark">◎</span><span>Civisfera</span></a>
        <nav class="nav-links" id="navLinks" aria-label="Navigazione principale">${nav}</nav>
        <div class="header-actions">
          <button class="icon-button" id="quickSearchBtn" title="Cerca">🔎</button>
          <button class="menu-toggle" id="menuToggle" aria-label="Apri menu">☰</button>
        </div>
      </div>`;
    document.body.prepend(header);
    document.getElementById('menuToggle')?.addEventListener('click',()=>document.getElementById('navLinks').classList.toggle('open'));
    document.getElementById('quickSearchBtn')?.addEventListener('click',()=>openSearchModal());
  }

  function renderFooter(){
    const footer=document.createElement('footer'); footer.className='footer';
    footer.innerHTML=`<div class="footer-inner">
      <div><div class="brand"><span class="brand-mark">◎</span><span>Civisfera</span></div><p class="muted">Il sito che trasforma problemi pratici in percorsi, checklist, scadenze e testi già pronti.</p></div>
      <div><p class="small"><b>Nota:</b> le guide sono strumenti organizzativi. Per salute, emergenze, pratiche legali o scadenze ufficiali verifica sempre con servizi pubblici, professionisti o fonti ufficiali.</p><p class="small"><a href="profilo.html">Impostazioni accessibilità</a> · <a href="emergenze.html">Emergenze</a></p></div>
    </div>`;
    document.body.appendChild(footer);
  }

  function scoreItem(item,q){
    const text=[item.title,item.summary,item.desc,item.keywords,item.cat].join(' ').toLowerCase();
    const query=q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const normalized=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const aliases={
      'povera':'isee bonus soldi agevolazione università',
      'portafoglio':'documenti smarriti carte bancomat denuncia tessera sanitaria patente',
      'votare':'tessera elettorale documento voto comune',
      'registro':'email segreteria scuola professore registro elettronico',
      'verifica':'scuola studio interrogazione planner quiz',
      'medico':'salute cup visita ricetta impegnativa',
      'casa':'affitto utenze residenza budget',
      'lavoro':'cv curriculum colloquio contratto',
      'mail':'email professore segreteria generatore'
    };
    let words=query.split(/\s+/).filter(Boolean);
    Object.entries(aliases).forEach(([k,v])=>{ if(query.includes(k)) words=words.concat(v.split(' ')) });
    return words.reduce((sum,w)=> sum+(normalized.includes(w)?1:0),0);
  }
  function searchAll(q){
    const guides=(window.CIVI_DATA.guides||[]).map(x=>({...x,type:'Guida',url:`guide.html#${x.id}`,score:scoreItem(x,q)}));
    const paths=(window.CIVI_DATA.paths||[]).map(x=>({...x,type:'Percorso',url:`percorso.html#${x.id}`,score:scoreItem(x,q)}));
    const cats=(window.CIVI_DATA.categories||[]).map(x=>({...x,type:'Sezione',url:x.page,summary:x.desc,score:scoreItem(x,q)}));
    return [...guides,...paths,...cats].filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,10);
  }
  function resultHTML(r){
    const meta=r.type==='Guida'?`<span class="pill">${esc(r.difficulty)}</span><span class="pill">${esc(r.time)}</span><span class="pill ${r.online?'green':'yellow'}">${r.online?'Online possibile':'Ufficio fisico'}</span>`:'';
    return `<a class="search-result" href="${r.url}"><b>${esc(r.title)}</b><span class="small muted">${esc(r.type)} · ${esc(r.summary||r.desc||'')}</span><span class="meta-row">${meta}</span></a>`;
  }
  function bindSearch(input,container){
    if(!input||!container) return;
    const render=()=>{
      const q=input.value.trim();
      if(q.length<2){container.classList.add('hidden'); container.innerHTML=''; return}
      const rows=searchAll(q);
      container.innerHTML=rows.length? rows.map(resultHTML).join('') : `<div class="card compact">Nessun risultato preciso. Prova con parole come ISEE, documento, verifica, visita, lavoro.</div>`;
      container.classList.remove('hidden');
    };
    input.addEventListener('input',render);
    input.addEventListener('focus',render);
    document.addEventListener('click',e=>{if(!container.contains(e.target)&&e.target!==input) container.classList.add('hidden')});
  }
  function openSearchModal(){
    openModal(`<h2>Ricerca intelligente</h2><p class="muted">Scrivi il problema con parole normali.</p><div style="position:relative"><input id="modalSearchInput" class="input" placeholder="es. ho perso il portafoglio"><div id="modalSearchResults" class="search-results hidden"></div></div>`,'Cerca in Civisfera');
    setTimeout(()=>{const i=document.getElementById('modalSearchInput');bindSearch(i,document.getElementById('modalSearchResults'));i?.focus()},60);
  }
  function openModal(body,title='Dettaglio'){
    let backdrop=document.querySelector('.modal-backdrop');
    if(!backdrop){backdrop=document.createElement('div');backdrop.className='modal-backdrop';document.body.appendChild(backdrop)}
    backdrop.innerHTML=`<div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h3>${esc(title)}</h3></div><button class="modal-close" aria-label="Chiudi">✕</button></div><div>${body}</div></div>`;
    backdrop.classList.add('open');
    backdrop.querySelector('.modal-close').addEventListener('click',()=>backdrop.classList.remove('open'));
    backdrop.addEventListener('click',e=>{if(e.target===backdrop) backdrop.classList.remove('open')},{once:true});
  }

  function saveChecklist(title,items,source='Manuale'){
    return patch(state=>{
      state.checklists.unshift({id:uid('check'),title,source,createdAt:new Date().toISOString(),items:items.map(text=>({text,done:false}))});
    });
  }
  function saveMessage(type,title,body){
    return patch(state=>{state.messages.unshift({id:uid('msg'),type,title,body,createdAt:new Date().toISOString()})});
  }
  function saveDeadline(data){
    return patch(state=>{state.deadlines.push({id:uid('deadline'),createdAt:new Date().toISOString(),...data})});
  }
  function toggleFavorite(id){
    return patch(state=>{state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id]});
  }

  window.Civisfera={
    uid,esc,read,write,patch,toast,applySettings,renderHeader,renderFooter,bindSearch,searchAll,openModal,openSearchModal,
    formatDate,daysUntil,priorityClass,saveChecklist,saveMessage,saveDeadline,toggleFavorite,getParam,todayISO
  };

  document.addEventListener('DOMContentLoaded',()=>{
    renderHeader();
    applySettings(read().settings);
    renderFooter();
  });
})();
