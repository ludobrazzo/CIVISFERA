(function(){
  const A=()=>window.Civisfera;
  const D=()=>window.CIVI_DATA;
  const esc=s=>A().esc(s);

  function localReply(text){
    const q=text.toLowerCase();
    const results=A().searchAll(text).slice(0,3);
    if(q.includes('mail')||q.includes('email')) return 'Per creare una mail pronta vai in “Generatori”. Posso anche darti una struttura: oggetto preciso, saluto formale, motivo, richiesta chiara, ringraziamento e firma.';
    if(q.includes('isee')) return 'Per l’ISEE prepara documento, codice fiscale, SPID/CIE se fai online, saldo e giacenza media, redditi e dati del nucleo familiare. Puoi aprire il percorso guidato “Devo fare l’ISEE”.';
    if(q.includes('portafoglio')||q.includes('rubato')||q.includes('smarrito')) return 'Prima azione: blocca carte bancarie e app di pagamento. Poi fai elenco dei documenti persi, controlla movimenti e valuta denuncia. Apri Emergenze > Portafoglio perso.';
    if(q.includes('interrog')||q.includes('verifica')||q.includes('studio')) return 'Per studiare: dividi argomento, crea riassunto breve, prepara domande, ripeti ad alta voce e fai una simulazione. In “Scuola” trovi planner e Interrogami.';
    if(q.includes('medic')||q.includes('visita')||q.includes('cup')) return 'Per una visita: controlla se serve impegnativa, prenota tramite CUP/struttura, salva data e prepara tessera sanitaria, documento, referti e domande per il medico. Il sito non fa diagnosi.';
    if(results.length){
      return 'Risultati più utili:\n' + results.map((r,i)=>`${i+1}. ${r.title} — ${r.type}`).join('\n') + '\n\nApri la ricerca o la sezione indicata per iniziare il percorso.';
    }
    return 'Descrivi il problema con parole semplici. Posso indirizzarti verso guide, checklist, scadenze, email formali, studio, lavoro, salute o documenti.';
  }

  async function askServer(message){
    try{
      const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});
      if(!res.ok) throw new Error('server non disponibile');
      const data=await res.json();
      return data.reply;
    }catch(e){return null}
  }

  function addMessage(panel,role,text){
    const box=panel.querySelector('.chat-messages');
    const msg=document.createElement('div'); msg.className=`message ${role}`; msg.textContent=text; box.appendChild(msg); box.scrollTop=box.scrollHeight;
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const launcher=document.createElement('button'); launcher.className='chat-launcher'; launcher.setAttribute('aria-label','Apri assistente'); launcher.textContent='◔';
    const panel=document.createElement('aside'); panel.className='chat-panel'; panel.innerHTML=`
      <div class="chat-head"><div><b>Assistente Civisfera</b><div class="tiny">Percorsi, checklist, testi</div></div><button id="chatClose">✕</button></div>
      <div class="chat-messages"><div class="message bot">Scrivi il problema. Esempi: “ho perso il portafoglio”, “devo fare l’ISEE”, “devo scrivere una mail”.</div></div>
      <div class="chat-suggestions">
        <button class="btn ghost small-btn" data-chat-suggestion="Ho perso il portafoglio">Portafoglio</button>
        <button class="btn ghost small-btn" data-chat-suggestion="Devo fare l’ISEE">ISEE</button>
        <button class="btn ghost small-btn" data-chat-suggestion="Devo preparare un’interrogazione">Interrogazione</button>
      </div>
      <form class="chat-form"><textarea aria-label="Messaggio" placeholder="Scrivi qui..."></textarea><button class="btn" aria-label="Invia">➜</button></form>`;
    document.body.append(panel,launcher);
    launcher.addEventListener('click',()=>panel.classList.toggle('open'));
    panel.querySelector('#chatClose').addEventListener('click',()=>panel.classList.remove('open'));
    document.addEventListener('click',e=>{if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==launcher) panel.classList.remove('open')});
    panel.querySelectorAll('[data-chat-suggestion]').forEach(b=>b.addEventListener('click',()=>submit(b.dataset.chatSuggestion)));
    panel.querySelector('form').addEventListener('submit',e=>{e.preventDefault(); const ta=panel.querySelector('textarea'); const text=ta.value.trim(); if(text){ta.value=''; submit(text)}});
    async function submit(text){
      panel.classList.add('open'); addMessage(panel,'user',text); addMessage(panel,'bot','Sto costruendo una risposta pratica...');
      const box=panel.querySelector('.chat-messages'); const last=box.lastElementChild;
      const remote=await askServer(text);
      last.textContent=remote||localReply(text);
      box.scrollTop=box.scrollHeight;
    }
  });
})();
