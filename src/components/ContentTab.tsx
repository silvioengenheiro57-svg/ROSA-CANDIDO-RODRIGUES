import React, { useState } from 'react';
import { ContentResource } from '../types';
import { INITIAL_RESOURCES, LESSON_COVER, TEACHER_ERIC_AVATAR } from '../data/mockData';
import { speakEnglish, stopSpeaking } from '../utils/speech';

export const ContentTab: React.FC = () => {
  const [viewMode, setViewMode] = useState<'studio' | 'explore'>('studio');
  const [resources, setResources] = useState<ContentResource[]>(INITIAL_RESOURCES);

  // Form states for Studio
  const [selectedFormat, setSelectedFormat] = useState<'article' | 'audio' | 'video' | 'pdf' | 'challenge'>('article');
  const [selectedSkill, setSelectedSkill] = useState<'Grammar' | 'Vocabulary' | 'Speaking & Accent' | 'Business English'>('Grammar');
  const [selectedLevel, setSelectedLevel] = useState<'A1-A2' | 'B1-B2' | 'C1-C2' | 'Todos'>('B1-B2');
  const [title, setTitle] = useState('Mastering "Used to" vs "Be Used to" no Trabalho Remoto');
  const [hook, setHook] = useState('Aprenda a diferenciar hábitos passados de costumes diários com exemplos reais de reuniões síncronas e assíncronas em inglês.');
  const [tip, setTip] = useState('Muitos alunos confundem a estrutura. Lembre-se: \n• I used to live = Ação do passado que não acontece mais.\n• I am used to living = Estou acostumado com isso hoje.');
  const [bodyText, setBodyText] = useState('Quando estiver numa daily standup internacional, evite dizer "I am used to work late" se quer dizer que no passado trabalhava até tarde. Diga: "I used to work late, but now I prefer mornings."');
  const [aiTutorIntegration, setAiTutorIntegration] = useState(true);
  const [pushNotification, setPushNotification] = useState(true);
  const [linkedChannel, setLinkedChannel] = useState('#grammar-lab');

  // Audio preview playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState<string | null>(null);

  // Interactive Quiz Modal for exploring students
  const [activeQuizResource, setActiveQuizResource] = useState<ContentResource | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleTogglePlayAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakEnglish('I used to work late, but now I am used to waking up early for international meetings.', () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handlePublishContent = () => {
    if (!title.trim()) return;

    const newResource: ContentResource = {
      id: 'res-' + Date.now(),
      title,
      hook,
      type: selectedFormat,
      category: selectedSkill,
      level: selectedLevel,
      author: 'Teacher Éric',
      readTime: '3 min de estudo',
      coverImage: LESSON_COVER,
      audioFile: {
        name: 'pronunciation_used_to_eric.mp3',
        duration: '01:24',
        size: '1.8 MB',
      },
      ericTip: tip,
      bodyText,
      hasAiQuiz: aiTutorIntegration,
      linkedChannel,
      publishedAt: 'Publicado agora',
    };

    setResources([newResource, ...resources]);
    setPublishFeedback('Conteúdo publicado com sucesso no feed da comunidade!');

    setTimeout(() => {
      setPublishFeedback(null);
      setViewMode('explore');
    }, 1800);
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-3xl mx-auto min-h-[calc(100vh-64px)] px-4">
      {/* Top Segmented Navigation: Studio vs Explore Feed */}
      <div className="pt-3 pb-2 flex items-center justify-between gap-2 border-b border-[#434655]/20 mb-3">
        <div className="flex items-center gap-1 bg-[#171f33] p-1 rounded-full border border-[#434655]/30">
          <button
            onClick={() => setViewMode('studio')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-label-sm font-semibold transition-all ${
              viewMode === 'studio'
                ? 'bg-[#2563eb] text-[#eeefff] shadow-sm'
                : 'text-[#c3c6d7] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>Studio / Criar Conteúdo</span>
          </button>
          <button
            onClick={() => setViewMode('explore')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-label-sm font-semibold transition-all ${
              viewMode === 'explore'
                ? 'bg-[#2563eb] text-[#eeefff] shadow-sm'
                : 'text-[#c3c6d7] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Feed de Alunos ({resources.length})</span>
          </button>
        </div>

        <span className="text-xs text-[#8d90a0] hidden sm:inline">
          {viewMode === 'studio' ? 'Área do Mentor' : 'Visualização do Estudante'}
        </span>
      </div>

      {publishFeedback && (
        <div className="p-3 mb-3 rounded-xl bg-[#007d55] text-[#bdffdb] text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{publishFeedback}</span>
        </div>
      )}

      {viewMode === 'studio' ? (
        /* Studio / Publish Content View (Image 12 & HTML) */
        <div className="flex flex-col gap-4">
          {/* Top Status Card */}
          <section className="bg-[#222a3d] rounded-2xl p-4 shadow-md flex flex-col gap-2 border border-[#434655]/30">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ee9800]/20 text-[#ffb95f] font-label-sm text-xs font-bold border border-[#ee9800]/30">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  Mentor Oficial
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2d3449] text-[#c3c6d7] font-label-sm text-xs">
                  Studio
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#c3c6d7] font-caption text-xs shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span>Rascunho salvo</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="min-w-0">
                <p className="font-label-sm text-xs text-[#ffb95f] uppercase tracking-wider font-bold">
                  Novo Recurso Didático
                </p>
                <p className="font-headline-sm text-lg text-[#dae2fd] truncate font-bold">
                  Publicar Conteúdo
                </p>
              </div>
              <button
                onClick={handlePublishContent}
                className="px-4 py-2 rounded-full bg-[#2563eb] hover:bg-[#2563eb]/90 text-[#eeefff] font-label-md text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Publicar</span>
              </button>
            </div>
          </section>

          {/* Format Selector */}
          <section className="flex flex-col gap-1.5">
            <span className="font-label-sm text-xs text-[#c3c6d7] uppercase tracking-wider px-1 font-bold">
              Formato do Recurso
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
              {[
                { id: 'article', label: 'Artigo / Gramática', icon: 'article' },
                { id: 'audio', label: 'Áudio & Listening', icon: 'headphones' },
                { id: 'video', label: 'Micro-Vídeo', icon: 'movie' },
                { id: 'pdf', label: 'PDF de Apoio', icon: 'picture_as_pdf' },
                { id: 'challenge', label: 'Desafio Prático', icon: 'bolt' },
              ].map((fmt) => {
                const isActive = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-label-md text-xs font-semibold shrink-0 transition-all border ${
                      isActive
                        ? 'bg-[#2563eb] text-[#eeefff] border-[#2563eb] shadow-sm'
                        : 'bg-[#171f33] text-[#c3c6d7] hover:text-[#dae2fd] border-[#434655]/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{fmt.icon}</span>
                    <span>{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Category & Level */}
          <section className="bg-[#171f33] rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-[#434655]/30">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-xs text-[#c3c6d7] uppercase tracking-wider font-bold">
                Habilidade Pedagógica
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Grammar',
                  'Vocabulary',
                  'Speaking & Accent',
                  'Business English',
                ].map((skill) => {
                  const isActive = selectedSkill === skill;
                  return (
                    <button
                      key={skill}
                      onClick={() => setSelectedSkill(skill as any)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-label-md text-xs font-semibold transition-all text-left border ${
                        isActive
                          ? 'bg-[#2563eb] text-[#eeefff] border-[#2563eb]'
                          : 'bg-[#222a3d] text-[#c3c6d7] hover:text-[#dae2fd] border-[#434655]/20'
                      }`}
                    >
                      <span>{skill}</span>
                      <span className={`material-symbols-outlined text-[16px] ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                        check
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <label className="font-label-sm text-xs text-[#c3c6d7] uppercase tracking-wider font-bold">
                Nível Recomendado
              </label>
              <div className="flex items-center gap-2">
                {(['A1-A2', 'B1-B2', 'C1-C2', 'Todos'] as const).map((lvl) => {
                  const isActive = selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`flex-1 py-1.5 px-2 rounded-full font-label-sm text-xs font-semibold text-center transition-all border ${
                        isActive
                          ? 'bg-[#2563eb] text-[#eeefff] border-[#2563eb] shadow-sm'
                          : 'bg-[#222a3d] text-[#c3c6d7] hover:text-[#dae2fd] border-[#434655]/20'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Main Creation Form */}
          <section className="bg-[#171f33] rounded-2xl p-4 shadow-sm flex flex-col gap-4 border border-[#434655]/30">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-[#c3c6d7] uppercase tracking-wider font-bold">
                Título Principal
              </label>
              <div className="bg-[#131b2e] rounded-xl px-3.5 py-2.5 border border-[#434655]/30">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-[#dae2fd] font-headline-sm text-base font-bold focus:outline-none placeholder:text-[#8d90a0]"
                  placeholder="Ex: Master phrasal verbs in meetings"
                />
              </div>
            </div>

            {/* Hook */}
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-[#c3c6d7] uppercase tracking-wider font-bold">
                Hook / Resumo para a Comunidade
              </label>
              <div className="bg-[#131b2e] rounded-xl px-3.5 py-2.5 border border-[#434655]/30">
                <textarea
                  rows={2}
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  className="w-full bg-transparent text-[#dae2fd] font-body-sm text-xs sm:text-sm focus:outline-none placeholder:text-[#8d90a0] resize-none"
                  placeholder="Qual é o benefício prático imediato para os alunos?"
                />
              </div>
            </div>

            {/* Rich Editor Block */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-sm text-xs text-[#c3c6d7] uppercase tracking-wider font-bold">
                  Conteúdo & Explicação
                </label>
                <span className="font-caption text-xs text-[#ffb95f] flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  Assistente AI Ativo
                </span>
              </div>

              <div className="bg-[#131b2e] rounded-2xl overflow-hidden flex flex-col border border-[#434655]/30">
                {/* Formatting Toolbar */}
                <div className="bg-[#222a3d] px-2 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-[#434655]/20">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#2d3449]">
                    <span className="material-symbols-outlined text-[18px]">format_bold</span>
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#2d3449]">
                    <span className="material-symbols-outlined text-[18px]">format_italic</span>
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#2d3449]">
                    <span className="material-symbols-outlined text-[18px]">format_quote</span>
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#2d3449]">
                    <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                  </button>

                  <div className="w-px h-4 bg-[#434655] mx-1"></div>

                  <button
                    onClick={() => {
                      setTip((prev) => prev + '\n• Regra chave: Use "used to" para passado, e "be used to" para acostumar-se.');
                    }}
                    className="px-2.5 h-7 rounded-full bg-[#ee9800]/20 text-[#ffb95f] font-label-sm text-xs flex items-center gap-1 hover:bg-[#ee9800]/30 font-semibold border border-[#ee9800]/30"
                  >
                    <span className="material-symbols-outlined text-[15px]">psychology</span>
                    <span>Gerar Quiz</span>
                  </button>
                  <button
                    onClick={() => {
                      setBodyText((prev) => prev + ' /juːst tuː/ vs /biː juːst tuː/');
                    }}
                    className="px-2.5 h-7 rounded-full bg-[#2563eb]/20 text-[#b4c5ff] font-label-sm text-xs flex items-center gap-1 hover:bg-[#2563eb]/30 font-semibold border border-[#2563eb]/30"
                  >
                    <span className="material-symbols-outlined text-[15px]">record_voice_over</span>
                    <span>Snippet IPA</span>
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-3.5 flex flex-col gap-3 font-body-sm text-xs sm:text-sm text-[#dae2fd] leading-relaxed">
                  <div className="bg-[#171f33] p-3 rounded-xl border border-[#ee9800]/30 flex flex-col gap-1">
                    <span className="font-label-sm text-xs text-[#ffb95f] uppercase font-bold tracking-wide">
                      💡 DICA RÁPIDA DE ÉRIC:
                    </span>
                    <textarea
                      rows={3}
                      value={tip}
                      onChange={(e) => setTip(e.target.value)}
                      className="w-full bg-transparent text-[#dae2fd] focus:outline-none resize-none font-body-sm text-xs sm:text-sm"
                    />
                  </div>

                  <textarea
                    rows={4}
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    className="w-full bg-transparent text-[#c3c6d7] focus:outline-none resize-none font-body-sm text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Media & Audio Attachment */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-xs text-[#c3c6d7] uppercase tracking-wider font-bold">
                Mídia & Áudio de Apoio
              </label>

              <div className="bg-[#222a3d] rounded-2xl p-3 flex flex-col gap-2 border border-[#434655]/30 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={handleTogglePlayAudio}
                      className="w-10 h-10 rounded-full bg-[#4edea3] hover:bg-[#4edea3]/90 text-[#003824] flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-all"
                      title="Ouvir áudio gravado"
                    >
                      <span
                        className="material-symbols-outlined text-[22px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isPlayingAudio ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div className="min-w-0">
                      <p className="font-label-md text-xs sm:text-sm text-[#dae2fd] truncate font-semibold">
                        pronunciation_used_to_eric.mp3
                      </p>
                      <p className="font-caption text-xs text-[#8d90a0]">
                        01:24 • 1.8 MB • Qualidade HD Studio
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('Áudio resetado')}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#ffb4ab] hover:bg-[#93000a]/20 transition-all shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                {/* Waveform graphic */}
                <div className="bg-[#060e20] h-7 rounded-lg px-3 flex items-center justify-between gap-1 overflow-hidden border border-[#434655]/20">
                  <div className="h-3 w-1 rounded-full bg-[#4edea3]"></div>
                  <div className="h-5 w-1 rounded-full bg-[#4edea3]"></div>
                  <div className="h-4 w-1 rounded-full bg-[#4edea3]"></div>
                  <div className="h-2 w-1 rounded-full bg-[#4edea3]"></div>
                  <div className="h-6 w-1 rounded-full bg-[#4edea3]"></div>
                  <div className="h-3 w-1 rounded-full bg-[#4edea3]"></div>
                  <div className="h-5 w-1 rounded-full bg-[#4edea3]"></div>
                  <div className="h-2 w-1 rounded-full bg-[#434655]"></div>
                  <div className="h-4 w-1 rounded-full bg-[#434655]"></div>
                  <div className="h-3 w-1 rounded-full bg-[#434655]"></div>
                  <div className="h-6 w-1 rounded-full bg-[#434655]"></div>
                  <div className="h-2 w-1 rounded-full bg-[#434655]"></div>
                  <div className="h-5 w-1 rounded-full bg-[#434655]"></div>
                  <div className="h-3 w-1 rounded-full bg-[#434655]"></div>
                  <div className="h-4 w-1 rounded-full bg-[#434655]"></div>
                </div>
              </div>

              {/* Triggers */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleTogglePlayAudio}
                  className="py-2.5 px-3 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] font-label-sm text-xs flex items-center justify-center gap-1.5 transition-all font-semibold border border-[#434655]/20"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#4edea3]">mic</span>
                  <span>Gravar Áudio Direto</span>
                </button>
                <button
                  onClick={() => alert('Anexo de documento adicionado')}
                  className="py-2.5 px-3 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] font-label-sm text-xs flex items-center justify-center gap-1.5 transition-all font-semibold border border-[#434655]/20"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#b4c5ff]">upload_file</span>
                  <span>Anexar PDF / Vídeo</span>
                </button>
              </div>
            </div>
          </section>

          {/* Integrations & Channel Link */}
          <section className="bg-[#171f33] rounded-2xl p-4 shadow-sm flex flex-col gap-4 border border-[#434655]/30">
            {/* AI English Tutor switch */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#2563eb]/20 text-[#b4c5ff] flex items-center justify-center shrink-0 mt-0.5 border border-[#2563eb]/30">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="font-headline-sm text-sm sm:text-base text-[#dae2fd] leading-tight font-bold">
                    Integrar com AI English Tutor
                  </p>
                  <p className="font-body-sm text-xs text-[#c3c6d7] mt-1 leading-snug">
                    Alunos poderão solicitar 5 exercícios práticos e roleplay interativo gerados automaticamente deste conteúdo.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAiTutorIntegration(!aiTutorIntegration)}
                className={`w-12 h-7 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  aiTutorIntegration ? 'bg-[#2563eb]' : 'bg-[#434655]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-[#eeefff] shadow-sm transform transition-transform ${
                    aiTutorIntegration ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Linked Channel */}
            <div className="flex flex-col gap-1 pt-1">
              <label className="font-label-sm text-xs text-[#c3c6d7] uppercase tracking-wider font-bold">
                Canal da Comunidade Vinculado
              </label>
              <div className="bg-[#131b2e] rounded-xl px-3.5 py-2.5 flex items-center justify-between border border-[#434655]/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#ffb95f]">tag</span>
                  <span className="font-label-md text-sm text-[#dae2fd] font-semibold">{linkedChannel}</span>
                </div>
                <button
                  onClick={() => setLinkedChannel(linkedChannel === '#grammar-lab' ? '#english-only' : '#grammar-lab')}
                  className="font-label-sm text-xs text-[#b4c5ff] font-semibold hover:underline"
                >
                  Alterar
                </button>
              </div>
            </div>

            {/* Notification switch */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#ee9800]/20 text-[#ffb95f] flex items-center justify-center shrink-0 border border-[#ee9800]/30">
                  <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                </div>
                <span className="font-label-md text-xs sm:text-sm text-[#dae2fd] truncate font-semibold">
                  Notificar membros no telemóvel
                </span>
              </div>
              <button
                onClick={() => setPushNotification(!pushNotification)}
                className={`w-12 h-7 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  pushNotification ? 'bg-[#2563eb]' : 'bg-[#434655]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-[#eeefff] shadow-sm transform transition-transform ${
                    pushNotification ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Student Live Preview Card */}
          <section className="flex flex-col gap-1.5">
            <span className="font-label-sm text-xs text-[#c3c6d7] uppercase tracking-wider px-1 font-bold">
              Pré-visualização no Feed dos Alunos
            </span>

            <div className="bg-[#222a3d] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col gap-3.5 border border-[#434655]/30">
              {/* Cover Image */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-inner">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${LESSON_COVER}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060e20]/95 via-[#060e20]/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#2563eb] text-[#eeefff] font-label-sm text-xs font-bold shadow-sm">
                    {selectedSkill} • {selectedLevel}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#060e20]/80 text-[#dae2fd] font-caption text-xs flex items-center gap-1 backdrop-blur-md border border-[#434655]/40">
                    <span className="material-symbols-outlined text-[14px] text-[#4edea3]">schedule</span>
                    3 min de estudo
                  </span>
                </div>
              </div>

              {/* Title & Author Info */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={TEACHER_ERIC_AVATAR}
                      alt="Teacher Eric"
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-[#434655]"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#4edea3]"></span>
                  </div>
                  <span className="font-label-sm text-xs text-[#c3c6d7] font-semibold">Teacher Éric</span>
                  <span className="text-[#8d90a0] font-caption">•</span>
                  <span className="font-caption text-xs text-[#ffb95f] font-semibold">Novo Recurso</span>
                </div>

                <h2 className="font-headline-sm text-base sm:text-lg text-[#dae2fd] leading-tight font-bold">
                  {title}
                </h2>
                <p className="font-body-sm text-xs sm:text-sm text-[#c3c6d7] line-clamp-2 leading-relaxed">
                  {hook}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#434655]/20">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[#4edea3] font-label-sm text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">headphones</span>
                    Áudio de Pronúncia
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#b4c5ff] font-label-sm text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                    AI Quiz
                  </span>
                </div>
                <span className="font-label-md text-xs font-semibold text-[#b4c5ff] flex items-center gap-0.5">
                  Aceder
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </span>
              </div>
            </div>
          </section>

          {/* Bottom Secondary Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => alert('Rascunho guardado com sucesso!')}
              className="flex-1 py-3 px-4 rounded-full bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] font-label-md text-xs font-semibold text-center active:scale-95 transition-all border border-[#434655]/30"
            >
              Guardar Rascunho
            </button>
            <button
              onClick={handlePublishContent}
              className="flex-1 py-3 px-4 rounded-full bg-[#2563eb] text-[#eeefff] hover:bg-[#2563eb]/90 font-label-md text-xs font-semibold text-center shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <span>Publicar Agora</span>
            </button>
          </div>
        </div>
      ) : (
        /* Explore / Student Feed View */
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-headline-sm text-base sm:text-lg font-bold text-[#dae2fd]">
              Recursos e Lições Publicadas
            </h2>
            <span className="text-xs text-[#c3c6d7]">{resources.length} disponíveis</span>
          </div>

          {resources.map((item) => (
            <div
              key={item.id}
              className="bg-[#171f33] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col gap-3.5 border border-[#434655]/30 transition-all hover:border-[#2563eb]/40"
            >
              {/* Cover Image */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-inner">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060e20]/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2563eb] text-[#eeefff] font-label-sm text-xs font-bold shadow-sm">
                    {item.category} • {item.level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#060e20]/80 text-[#dae2fd] font-caption text-xs flex items-center gap-1 backdrop-blur-md">
                    <span className="material-symbols-outlined text-[14px] text-[#4edea3]">schedule</span>
                    {item.readTime}
                  </span>
                </div>
              </div>

              {/* Title & Author */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <img
                    src={TEACHER_ERIC_AVATAR}
                    alt={item.author}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-label-sm text-xs text-[#c3c6d7] font-semibold">{item.author}</span>
                  <span className="text-[#8d90a0] font-caption">•</span>
                  <span className="font-caption text-xs text-[#ffb95f]">{item.publishedAt}</span>
                </div>

                <h3 className="font-headline-sm text-base font-bold text-[#dae2fd] leading-tight">
                  {item.title}
                </h3>
                <p className="font-body-sm text-xs sm:text-sm text-[#c3c6d7] leading-relaxed">
                  {item.hook}
                </p>

                {item.ericTip && (
                  <div className="p-2.5 rounded-xl bg-[#222a3d] border border-[#ee9800]/20 text-xs text-[#dae2fd] mt-1 whitespace-pre-line">
                    <strong className="text-[#ffb95f]">💡 Dica de Éric:</strong> {item.ericTip}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#434655]/20 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      speakEnglish(item.title);
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#007d55]/30 hover:bg-[#007d55]/50 text-[#4edea3] font-label-sm text-xs flex items-center gap-1 font-semibold border border-[#4edea3]/30"
                  >
                    <span className="material-symbols-outlined text-[16px]">volume_up</span>
                    <span>Ouvir Pronúncia</span>
                  </button>

                  {item.hasAiQuiz && (
                    <button
                      onClick={() => {
                        setActiveQuizResource(item);
                        setSelectedQuizOption(null);
                        setQuizSubmitted(false);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#2563eb]/20 hover:bg-[#2563eb]/30 text-[#b4c5ff] font-label-sm text-xs flex items-center gap-1 font-semibold border border-[#2563eb]/30"
                    >
                      <span className="material-symbols-outlined text-[16px]">psychology</span>
                      <span>AI Quiz</span>
                    </button>
                  )}
                </div>

                <span className="text-xs text-[#8d90a0] font-caption">
                  Canal {item.linkedChannel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Quiz Modal */}
      {activeQuizResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060e20]/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#222a3d] p-5 shadow-2xl relative border border-[#434655]/40 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveQuizResource(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#171f33] flex items-center justify-center text-[#c3c6d7]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-2 text-[#ffb95f] mb-1">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              <h3 className="font-headline-sm text-base font-bold text-[#dae2fd]">
                AI Quiz • {activeQuizResource.title}
              </h3>
            </div>
            <p className="text-xs text-[#8d90a0] mb-4">
              Teste seu domínio deste tópico com o AI Tutor da comunidade.
            </p>

            <div className="p-3 rounded-xl bg-[#171f33] mb-4 border border-[#434655]/20">
              <p className="text-sm font-semibold text-[#dae2fd] mb-3">
                Complete a frase corretamente para uma reunião remota:
                <br />
                <span className="text-[#ffb95f] font-mono mt-1 block">
                  "When I joined this team, I ______ work late, but now I prefer early shifts."
                </span>
              </p>

              <div className="space-y-2">
                {[
                  'A) was used to',
                  'B) used to',
                  'C) am used to',
                  'D) used to working',
                ].map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === 1;
                  return (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setSelectedQuizOption(idx)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors border ${
                        isSelected
                          ? quizSubmitted
                            ? isCorrect
                              ? 'bg-[#007d55]/30 border-[#4edea3] text-[#4edea3]'
                              : 'bg-[#93000a]/30 border-[#ffb4ab] text-[#ffb4ab]'
                            : 'bg-[#2563eb]/20 border-[#2563eb] text-[#b4c5ff]'
                          : 'bg-[#131b2e] hover:bg-[#222a3d] border-[#434655]/30 text-[#dae2fd]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="mt-3 p-2.5 rounded-lg bg-[#131b2e] text-xs text-[#dae2fd] border border-[#4edea3]/30">
                  {selectedQuizOption === 1 ? (
                    <p className="text-[#4edea3] font-semibold">
                      🎉 Resposta Certa! Usamos "used to" + infinitivo para falar de um hábito passado que não acontece mais.
                    </p>
                  ) : (
                    <p className="text-[#ffb4ab]">
                      ❌ A resposta correta é B ("used to"). "Used to" indica uma ação habitual passada.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!quizSubmitted ? (
                <button
                  onClick={() => {
                    if (selectedQuizOption !== null) setQuizSubmitted(true);
                  }}
                  disabled={selectedQuizOption === null}
                  className="w-full py-2.5 rounded-full bg-[#2563eb] disabled:opacity-50 text-[#eeefff] font-label-md text-xs font-semibold shadow-md active:scale-95 transition-transform"
                >
                  Confirmar Resposta
                </button>
              ) : (
                <button
                  onClick={() => setActiveQuizResource(null)}
                  className="w-full py-2.5 rounded-full bg-[#2563eb] text-[#eeefff] font-label-md text-xs font-semibold shadow-md"
                >
                  Concluir Prática (+25 XP)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
