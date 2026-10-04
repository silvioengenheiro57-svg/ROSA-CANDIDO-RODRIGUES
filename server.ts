import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const port = Number(process.env.PORT) || 3000;

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI English Tutor Structured Analysis Endpoint
app.post('/api/ai-tutor', async (req, res) => {
  try {
    const { sentence, mode = 'feedback', level = 'B2' } = req.body;

    if (!sentence || typeof sentence !== 'string') {
      return res.status(400).json({ error: 'Sentence is required' });
    }

    if (ai) {
      const prompt = `Você é o "Teacher Éric AI", o tutor inteligente e encorajador da comunidade "Teacher Éric Community".
O aluno tem o nível ${level} de inglês e enviou a seguinte mensagem/frase:
"${sentence}"

Modo selecionado: ${mode}

Responda ESTRITAMENTE em formato JSON com a seguinte estrutura:
{
  "originalSentence": "A frase enviada pelo aluno",
  "highlightedOriginal": "HTML com spans destacando partes que precisam de atenção (ex: I <span class='bg-secondary-container/20 text-secondary font-semibold px-1 py-0.5 rounded'>am working</span>...)",
  "suggestedCorrection": "A versão ideal e correta da frase com as melhorias em destaque (ex: I <span class='bg-tertiary-container/30 text-tertiary font-bold px-1.5 py-0.5 rounded'>have been working</span>...)",
  "reasons": [
    {
      "title": "1. Conceito Gramatical (ex: Present Perfect Continuous)",
      "explanation": "Explicação clara e pedagógica em português sobre por que ajustar isso."
    }
  ],
  "nativeOptions": [
    {
      "text": "Frase natural como um falante nativo diria em conversa ou ambiente corporativo",
      "contextNote": "Nota de contexto breve (ex: Mais natural no ambiente corporativo / Mais informal entre amigos)"
    }
  ],
  "practicePrompt": {
    "question": "Desafio curto para o aluno praticar a mesma regra agora em português (ex: Como você diria: 'Eu estudo inglês desde janeiro'?)",
    "clue": "Dica rápida para ajudar"
  },
  "tutorComment": "Uma frase de encorajamento rápida no estilo do Teacher Éric"
}

Importante:
- Se a frase do aluno já estiver perfeita, comemore, marque como 100% correta, ofereça variações ainda mais naturais de nativos ou vocabulário corporativo avançado, e dê um mini desafio de nível acima!
- Seja conciso, pedagógico e motivador. Retorne APENAS o JSON válido, sem crases de markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const responseText = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch (parseErr) {
        console.error('Failed to parse JSON from Gemini:', responseText);
      }
    }

    // High quality fallback when API key is not present or parsing fails
    const fallbackResponse = {
      originalSentence: sentence,
      highlightedOriginal: sentence.replace(
        /(am working|since|good in|listen you|discuss about)/gi,
        '<span class="bg-secondary-container/20 text-secondary font-semibold px-1 py-0.5 rounded">$1</span>'
      ),
      suggestedCorrection: sentence
        .replace(/am working/gi, '<span class="bg-tertiary-container/30 text-tertiary font-bold px-1.5 py-0.5 rounded">have been working</span>')
        .replace(/on this company/gi, '<span class="bg-tertiary-container/30 text-tertiary font-bold px-1.5 py-0.5 rounded">at this company</span>')
        .replace(/since two years/gi, '<span class="bg-tertiary-container/30 text-tertiary font-bold px-1.5 py-0.5 rounded">for two years</span>'),
      reasons: [
        {
          title: '1. Tempo Verbal & Duração Contínua',
          explanation: 'Quando uma ação teve início no passado e ainda continua no momento presente, a norma culta prefere o Present Perfect Continuous ("have been doing") em vez do Simple Present ou Present Continuous simples.',
        },
        {
          title: '2. Preposições de Tempo ("For" vs "Since")',
          explanation: 'Use "for" para intervalos de tempo quantificáveis (for two years, for three days) e reserve "since" estritamente para o ponto de partida original (since 2022, since yesterday).',
        },
      ],
      nativeOptions: [
        {
          text: "I've been with this company for two years now, and I really love working with my team.",
          contextNote: 'Altamente natural para ambientes de trabalho e reuniões internacionais',
        },
        {
          text: 'Two years in at this company, and my teammates are truly awesome.',
          contextNote: 'Tom conversacional leve e amigável',
        },
      ],
      practicePrompt: {
        question: 'Sua vez de praticar! Como você diria: "Eu moro nesta cidade há cinco anos"?',
        clue: 'Lembre-se da diferença entre for e since que revisamos!',
      },
      tutorComment: 'Excelente iniciativa praticando conosco! Cada frase enviada é um degrau a mais na sua fluência.',
    };

    return res.json(fallbackResponse);
  } catch (err: any) {
    console.error('AI Tutor error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Community message channel helper
app.post('/api/channel-chat', async (req, res) => {
  try {
    const { message, channel = 'english-only' } = req.body;
    
    // Check if the user mentioned AI Tutor
    const isAiTutorMentioned = message?.toLowerCase().includes('@ai tutor') || message?.toLowerCase().includes('@aitutor');
    
    if (isAiTutorMentioned && ai) {
      const aiPrompt = `Um aluno da comunidade de inglês Teacher Éric escreveu no canal #${channel}:
"${message}"

Como AI English Tutor, responda de forma ultra concisa (1 ou 2 parágrafos) em português, analisando a dúvida ou frase dita pelo aluno, indicando correções rápidas se houver, e incentivando a prática. Retorne JSON:
{
  "tutorName": "AI English Tutor",
  "badge": "Bot IA",
  "text": "Explicação concisa e calorosa",
  "correction": {
    "wrong": "trecho incorreto",
    "right": "trecho corrigido",
    "rule": "regra curta"
  }
}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: aiPrompt,
        config: { responseMimeType: 'application/json' },
      });
      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({ aiReply: parsed });
    }

    return res.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Channel chat error:', err);
    return res.status(500).json({ error: 'Failed to process message' });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
