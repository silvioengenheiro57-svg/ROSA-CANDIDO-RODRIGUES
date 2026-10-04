import React, { useState, useRef, useEffect } from 'react';
import { speakEnglish, stopSpeaking } from '../utils/speech';

interface AiAnalysisResult {
  originalSentence: string;
  highlightedOriginal: string;
  suggestedCorrection: string;
  reasons: Array<{ title: string; explanation: string }>;
  nativeOptions: Array<{ text: string; contextNote: string }>;
  practicePrompt: { question: string; clue: string };
  tutorComment?: string;
  time: string;
}

interface AiTutorTabProps {
  initialSentence?: string;
}

export const AiTutorTab: React.FC<AiTutorTabProps> = ({ initialSentence = '' }) => {
  const [activeMode, setActiveMode] = useState<string>('Corrigir Frases');
  const [inputSentence, setInputSentence] = useState(initialSentence);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Practice mini-challenge state inside the card
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);

  // Initial history matching image 6
  const [history, setHistory] = useState<AiAnalysisResult[]>([
    {
      originalSentence: 'I am working on this company since two years and I really like my colleagues.',
      highlightedOriginal: '"I <span class="bg-[#ee9800]/20 text-[#ffb95f] font-semibold px-1 py-0.5 rounded">am working</span> <span class="bg-[#ee9800]/20 text-[#ffb95f] font-semibold px-1 py-0.5 rounded">on</span> this company <span class="bg-[#ee9800]/20 text-[#ffb95f] font-semibold px-1 py-0.5 rounded">since</span> two years..."',
      suggestedCorrection: '"I <span class="bg-[#007d55]/30 text-[#4edea3] font-bold px-1.5 py-0.5 rounded">have been working</span> <span class="bg-[#007d55]/30 text-[#4edea3] font-bold px-1.5 py-0.5 rounded">at</span> this company <span class="bg-[#007d55]/30 text-[#4edea3] font-bold px-1.5 py-0.5 rounded">for</span> two years..."',
      reasons: [
        {
          title: '1. Present Perfect Continuous',
          explanation: 'Como a ação começou no passado e ainda continua no presente, usamos "have been working" em vez de "am working".',
        },
        {
          title: '2. "For" vs "Since"',
          explanation: 'Use "for" com períodos de tempo mensuráveis (two years, three months) e reserve "since" apenas para pontos de partida fixos (since 2022).',
        },
      ],
      nativeOptions: [
        {
          text: "I've been with this company for two years now, and I love my team.",
          contextNote: 'Mais natural no ambiente corporativo',
        },
      ],
      practicePrompt: {
        question: 'Como você diria: "Eu estudo inglês desde janeiro"? Use as dicas de since/for que vimos acima!',
        clue: 'Pense no ponto de partida fixo no calendário (January)',
      },
      tutorComment: 'Excelente iniciativa! Esse ajuste no Present Perfect é o divisor de águas entre o nível B1 e B2.',
      time: '14:32',
    },
  ]);

  const streamEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSentence) {
      setInputSentence(initialSentence);
    }
  }, [initialSentence]);

  const handleAnalyzeSentence = async (textToAnalyze?: string) => {
    const text = (textToAnalyze !== undefined ? textToAnalyze : inputSentence).trim();
    if (!text) return;

    setIsLoading(true);
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: text,
          mode: activeMode,
          level: 'B2',
        }),
      });

      if (!res.ok) {
        throw new Error('Falha ao conectar com o Tutor');
      }

      const data = await res.json();

      const newResult: AiAnalysisResult = {
        originalSentence: data.originalSentence || text,
        highlightedOriginal: data.highlightedOriginal || text,
        suggestedCorrection: data.suggestedCorrection || text,
        reasons: data.reasons || [
          {
            title: 'Análise Estrutural',
            explanation: 'Sua mensagem foi compreendida perfeitamente e soa compreensível.',
          },
        ],
        nativeOptions: data.nativeOptions || [
          {
            text: text,
            contextNote: 'Expressão recomendada',
          },
        ],
        practicePrompt: data.practicePrompt || {
          question: 'Pratique reformulando esta mesma ideia com outras palavras!',
          clue: 'Use vocabulário alternativo',
        },
        tutorComment: data.tutorComment || 'Muito bem! Continue praticando diariamente.',
        time: nowTime,
      };

      setHistory((prev) => [...prev, newResult]);
      setInputSentence('');
      setPracticeAnswer('');
      setPracticeFeedback(null);
    } catch (err) {
      console.error('Error analyzing sentence:', err);
      // Fallback local result
      const fallbackResult: AiAnalysisResult = {
        originalSentence: text,
        highlightedOriginal: `"${text}"`,
        suggestedCorrection: `"${text}"`,
        reasons: [
          {
            title: 'Consistência de Frase',
            explanation: 'A frase transmite clareza na ideia principal. Para enriquecer o vocabulário, experimente variar os conectivos.',
          },
        ],
        nativeOptions: [
          {
            text: `In natural English: "${text}"`,
            contextNote: 'Uso comum no dia a dia',
          },
        ],
        practicePrompt: {
          question: 'Como você diria essa mesma frase no passado simples?',
          clue: 'Ajuste os verbos principais',
        },
        tutorComment: 'Excelente iniciativa! Cada frase enviada aproxima você da fluência real.',
        time: nowTime,
      };
      setHistory((prev) => [...prev, fallbackResult]);
      setInputSentence('');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handlePlayVoice = (text: string) => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    speakEnglish(text, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleCheckPractice = (item: AiAnalysisResult) => {
    if (!practiceAnswer.trim()) {
      setPracticeFeedback('Por favor, escreva sua resposta em inglês primeiro!');
      return;
    }

    const clean = practiceAnswer.toLowerCase();
    if (clean.includes('have been studying') || clean.includes("'ve been studying") || clean.includes('have studied') || clean.includes('since january')) {
      setPracticeFeedback('🎉 Perfeito! "I have been studying English since January." Você aplicou a regra do Present Perfect + since com exatidão!');
    } else {
      setPracticeFeedback('💡 Quase lá! Lembre-se: use "I have been studying English..." + "since January" (ponto de partida no passado).');
    }
  };

  const handleToggleMic = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputSentence('I am living here since three months and I am liking the city.');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 gap-4 max-w-3xl mx-auto min-h-[calc(100vh-64px)]">
      {/* Status & Mode Selector */}
      <section className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between bg-[#131b2e] px-4 py-2 rounded-full shadow-sm border border-[#434655]/20">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
            </span>
            <span className="font-label-sm text-xs sm:text-sm text-[#4edea3] font-bold">Online</span>
            <span className="font-caption text-xs text-[#c3c6d7] hidden sm:inline">
              • Assistente Ativo de Inglês
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#171f33] px-2.5 py-1 rounded-full text-[#ffb95f] border border-[#ffb95f]/30">
            <span
              className="material-symbols-outlined text-[16px] text-[#ffb95f]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <span className="font-label-sm text-xs font-bold">Nível B2</span>
          </div>
        </div>

        {/* Practice Mode Horizontal Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          {[
            { id: 'Conversação Aberta', icon: '💬', label: 'Conversação Aberta' },
            { id: 'Corrigir Frases', icon: '✍️', label: 'Corrigir Frases' },
            { id: 'Simulação de Entrevista', icon: '🎯', label: 'Simulação de Entrevista' },
            { id: 'Desafio do Dia', icon: '🧠', label: 'Desafio do Dia' },
          ].map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-transform active:scale-95 shadow-sm border ${
                  isActive
                    ? 'bg-[#2563eb] text-[#eeefff] border-[#2563eb]'
                    : 'bg-[#171f33] text-[#c3c6d7] hover:text-[#dae2fd] border-[#434655]/20'
                }`}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Stream of Corrections */}
      <div className="flex flex-col gap-4" id="chat-stream">
        <div className="flex items-center justify-center my-1">
          <span className="bg-[#222a3d] text-[#c3c6d7] px-3 py-1 rounded-full font-label-sm text-xs tracking-wide border border-[#434655]/20">
            Hoje • Sessão de Feedback Gramatical
          </span>
        </div>

        {history.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            {/* User Message Bubble */}
            <div className="flex flex-col items-end gap-1 pl-8">
              <div className="flex items-center gap-1.5 pr-1">
                <span className="font-label-sm text-xs text-[#c3c6d7] font-semibold">Você</span>
                <span className="font-caption text-xs text-[#8d90a0]">{item.time}</span>
              </div>
              <div className="bg-[#2563eb] text-[#eeefff] px-4 py-3 rounded-2xl rounded-tr-sm shadow-md text-sm sm:text-base leading-relaxed">
                <p>{item.originalSentence}</p>
              </div>
              <span className="font-caption text-xs text-[#4edea3] flex items-center gap-1 pr-1">
                <span className="material-symbols-outlined text-[14px]">done_all</span> Enviado para análise
              </span>
            </div>

            {/* AI Tutor Feedback Complex Card */}
            <div className="flex flex-col gap-2 pr-2 sm:pr-4">
              {/* AI Identity Header */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#b4c5ff] flex items-center justify-center text-[#002a78] shadow-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-sm font-bold text-[#dae2fd]">Teacher Éric AI</span>
                  <span className="bg-[#171f33] text-[#ffb95f] text-xs font-label-sm px-2 py-0.5 rounded-full border border-[#ee9800]/30 font-semibold">
                    Análise Pontual
                  </span>
                </div>
                <span className="font-caption text-xs text-[#8d90a0] ml-auto">{item.time}</span>
              </div>

              {/* Main Structured Card */}
              <div className="bg-[#171f33] text-[#dae2fd] p-4 sm:p-5 rounded-2xl rounded-tl-sm shadow-lg flex flex-col gap-4 border border-[#434655]/30">
                {/* 1. Raio-X da sua frase */}
                <div>
                  <span className="font-label-sm text-xs uppercase tracking-wider text-[#ffb95f] flex items-center gap-1 mb-2 font-bold">
                    <span className="material-symbols-outlined text-[16px]">spellcheck</span>
                    RAIO-X DA SUA FRASE
                  </span>

                  <div className="bg-[#060e20] p-3.5 rounded-xl flex flex-col gap-2 border border-[#434655]/20">
                    <p
                      className="font-body-md text-sm sm:text-base text-[#dae2fd]"
                      dangerouslySetInnerHTML={{ __html: item.highlightedOriginal }}
                    />

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="material-symbols-outlined text-[#4edea3] text-[18px]">
                        arrow_downward
                      </span>
                      <span className="font-label-sm text-xs text-[#4edea3] font-bold">
                        Melhoria Sugerida:
                      </span>
                    </div>

                    <p
                      className="font-body-md text-sm sm:text-base text-[#dae2fd] font-medium bg-[#222a3d] p-3 rounded-lg border border-[#4edea3]/30"
                      dangerouslySetInnerHTML={{ __html: item.suggestedCorrection }}
                    />
                  </div>
                </div>

                {/* 2. Por que ajustamos isso? */}
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-xs uppercase tracking-wider text-[#b4c5ff] flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                    POR QUE AJUSTAMOS ISSO?
                  </span>

                  <div className="space-y-2 text-xs sm:text-sm text-[#c3c6d7]">
                    {item.reasons.map((r, rIdx) => (
                      <div key={rIdx} className="bg-[#131b2e] p-3 rounded-xl border border-[#434655]/20">
                        <span className="font-label-sm text-[#dae2fd] font-bold text-xs block mb-1">
                          {r.title}
                        </span>
                        <p className="leading-relaxed">{r.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Como um nativo falaria (Opções Naturais) */}
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-xs uppercase tracking-wider text-[#4edea3] flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                    COMO UM NATIVO FALARIA (OPÇÕES NATURAIS)
                  </span>

                  <div className="flex flex-col gap-2">
                    {item.nativeOptions.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className="bg-[#131b2e] p-3 rounded-xl flex items-start justify-between gap-3 border border-[#4edea3]/20"
                      >
                        <div className="flex flex-col">
                          <p className="text-xs sm:text-sm text-[#dae2fd] italic font-medium">
                            "{opt.text}"
                          </p>
                          <span className="font-caption text-xs text-[#8d90a0] mt-1">
                            {opt.contextNote}
                          </span>
                        </div>
                        <button
                          onClick={() => handlePlayVoice(opt.text)}
                          aria-label="Ouvir áudio"
                          className="w-8 h-8 rounded-full bg-[#2d3449] hover:bg-[#31394d] text-[#4edea3] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                          title="Tocar pronúncia nativa"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isPlayingAudio ? 'pause' : 'volume_up'}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Sua vez de praticar! */}
                {item.practicePrompt && (
                  <div className="bg-[#060e20] p-4 rounded-xl flex flex-col gap-2.5 shadow-inner border border-[#ee9800]/20">
                    <div className="flex items-center gap-1.5 text-[#ffb95f]">
                      <span className="material-symbols-outlined text-[18px]">quiz</span>
                      <span className="font-label-md text-sm font-bold">Sua vez de praticar!</span>
                    </div>

                    <p className="font-body-sm text-xs sm:text-sm text-[#dae2fd]">
                      {item.practicePrompt.question}
                    </p>

                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={practiceAnswer}
                          onChange={(e) => setPracticeAnswer(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCheckPractice(item);
                          }}
                          placeholder="Digite em inglês aqui..."
                          className="flex-1 bg-[#171f33] text-[#dae2fd] text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#434655]/40 focus:outline-none focus:border-[#2563eb]"
                        />
                        <button
                          onClick={() => handleCheckPractice(item)}
                          className="px-3 py-2 rounded-lg bg-[#2563eb] text-[#eeefff] font-label-sm text-xs font-semibold shrink-0"
                        >
                          Checar
                        </button>
                      </div>

                      {practiceFeedback && (
                        <div className="p-2.5 rounded-lg bg-[#171f33] text-xs text-[#dae2fd] border border-[#4edea3]/40">
                          {practiceFeedback}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#171f33] border border-[#2563eb]/30 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-[#eeefff]">
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#b4c5ff]">
                Teacher Éric AI está analisando sua frase...
              </span>
              <span className="text-xs text-[#8d90a0]">
                Verificando concordância, preposições e formulações naturais de nativos.
              </span>
            </div>
          </div>
        )}

        <div ref={streamEndRef} />
      </div>

      {/* Tutor Dynamic Prompts / Quick Chips */}
      <section className="flex flex-col gap-1.5 pt-2">
        <span className="font-label-sm text-xs text-[#8d90a0] flex items-center gap-1 px-1 font-semibold">
          <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Sugestões rápidas
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
          <button
            onClick={() => handleAnalyzeSentence('I will go to the office yesterday to pick up my laptop.')}
            className="shrink-0 bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-label-sm px-3.5 py-2 rounded-full transition-colors active:scale-95 flex items-center gap-1.5 border border-[#434655]/20 font-semibold"
          >
            <span className="material-symbols-outlined text-[#ffb95f] text-[16px]">check_circle</span>
            Corrige esta frase
          </button>
          <button
            onClick={() => handleAnalyzeSentence('What is the difference between "make a decision" and "take a decision"?')}
            className="shrink-0 bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-label-sm px-3.5 py-2 rounded-full transition-colors active:scale-95 flex items-center gap-1.5 border border-[#434655]/20 font-semibold"
          >
            <span className="material-symbols-outlined text-[#b4c5ff] text-[16px]">help_center</span>
            Explica este erro
          </button>
          <button
            onClick={() => handleAnalyzeSentence('Create a quick 3-question quiz for B2 Business English Phrasal Verbs.')}
            className="shrink-0 bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-label-sm px-3.5 py-2 rounded-full transition-colors active:scale-95 flex items-center gap-1.5 border border-[#434655]/20 font-semibold"
          >
            <span className="material-symbols-outlined text-[#4edea3] text-[16px]">psychology</span>
            Cria um exercício para o meu nível
          </button>
          <button
            onClick={() => handleAnalyzeSentence('Can you act as a hiring manager and ask me a classic technical interview question?')}
            className="shrink-0 bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-label-sm px-3.5 py-2 rounded-full transition-colors active:scale-95 flex items-center gap-1.5 border border-[#434655]/20 font-semibold"
          >
            <span className="material-symbols-outlined text-[#ffb95f] text-[16px]">terminal</span>
            Treinar entrevista de TI
          </button>
        </div>
      </section>

      {/* Interactive Input Console (Sticky-feeling Mobile Dock) */}
      <div className="fixed bottom-16 inset-x-0 z-40 bg-[#131b2e]/95 backdrop-blur-xl p-3 border-t border-[#434655]/20 shadow-xl">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          {/* Voice Practice Trigger */}
          <button
            aria-label="Praticar pronúncia com microfone"
            onClick={handleToggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 relative ${
              isRecording
                ? 'bg-[#ee9800]/20 text-[#ffb95f] ring-2 ring-[#ffb95f]'
                : 'bg-[#171f33] text-[#b4c5ff] hover:bg-[#222a3d]'
            }`}
            id="mic-btn"
            title="Falar em inglês para o AI Tutor"
          >
            <span className="material-symbols-outlined text-[24px]">mic</span>
            {isRecording && (
              <span className="absolute inset-0 rounded-full bg-[#ee9800]/40 animate-ping"></span>
            )}
          </button>

          {/* Textarea Input Area */}
          <div className="flex-1 bg-[#171f33] rounded-2xl px-3.5 py-2 min-h-[48px] flex items-center border border-[#434655]/30">
            <textarea
              id="user-input"
              rows={1}
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAnalyzeSentence();
                }
              }}
              placeholder={isRecording ? 'Ouvindo sua voz...' : 'Responda em inglês ou peça ajuda...'}
              className="w-full bg-transparent text-[#dae2fd] placeholder:text-[#8d90a0] text-sm font-body-sm resize-none focus:outline-none max-h-24"
            />
          </div>

          {/* Send Button */}
          <button
            aria-label="Enviar mensagem"
            onClick={() => handleAnalyzeSentence()}
            disabled={!inputSentence.trim() || isLoading}
            className="w-12 h-12 rounded-full bg-[#2563eb] text-[#eeefff] flex items-center justify-center active:scale-90 transition-all shadow-md shrink-0 disabled:opacity-50"
            id="send-btn"
          >
            <span className="material-symbols-outlined text-[22px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
