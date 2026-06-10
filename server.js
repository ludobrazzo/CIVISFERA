import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function fallbackReply(message = '') {
  const q = message.toLowerCase();
  if (q.includes('isee')) return 'Per l’ISEE: prepara documento, codice fiscale, SPID/CIE, saldo e giacenza media, redditi e dati del nucleo familiare. Apri Percorsi > Devo fare l’ISEE.';
  if (q.includes('portafoglio') || q.includes('smarrito') || q.includes('rubato')) return 'Prima azione: blocca carte e app di pagamento. Poi verifica documenti mancanti, movimenti sospetti, denuncia se necessaria e duplicati.';
  if (q.includes('mail') || q.includes('email')) return 'Vai in Generatori: compila destinatario, oggetto, motivo, tono e urgenza. Il sito genera una mail formale pronta.';
  return 'Posso aiutare con guide, percorsi, checklist, scadenze, documenti, studio, lavoro, salute ed emergenze. Scrivi il problema con parole semplici.';
}

app.post('/api/chat', async (req, res) => {
  const message = String(req.body?.message || '').slice(0, 3000);
  if (!message.trim()) return res.status(400).json({ error: 'Messaggio vuoto' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.json({ reply: fallbackReply(message), source: 'local-fallback' });

  try {
    const prompt = `Sei l’assistente di Civisfera. Rispondi in italiano, in modo pratico, breve e operativo. Non fare diagnosi mediche, non dare consulenza legale professionale, suggerisci sempre di verificare fonti ufficiali per pratiche e scadenze. Trasforma il problema in passaggi chiari e checklist. Problema utente: ${message}`;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!response.ok) throw new Error(`Gemini error ${response.status}`);
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n').trim();
    return res.json({ reply: reply || fallbackReply(message), source: 'gemini' });
  } catch (error) {
    console.error(error);
    return res.json({ reply: fallbackReply(message), source: 'local-fallback' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Civisfera attivo su http://localhost:${PORT}`);
});
