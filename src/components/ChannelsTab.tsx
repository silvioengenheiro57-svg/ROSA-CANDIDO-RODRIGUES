import React, { useState, useRef, useEffect } from 'react';
import { Channel, ChatMessage, Member } from '../types';
import { CHANNELS, INITIAL_CHANNEL_MESSAGES, SILVIO_AVATAR, TEACHER_ERIC_AVATAR } from '../data/mockData';
import { speakEnglish, stopSpeaking } from '../utils/speech';

interface ChannelsTabProps {
  onOpenMemberProfile: (memberId: string) => void;
  onOpenTutorWithSentence?: (sentence: string) => void;
}

export const ChannelsTab: React.FC<ChannelsTabProps> = ({
  onOpenMemberProfile,
  onOpenTutorWithSentence,
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>('english-only');
  const [channels, setChannels] = useState<Channel[]>(CHANNELS);
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, ChatMessage[]>>(INITIAL_CHANNEL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false);
  const [selectedMemberModal, setSelectedMemberModal] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [practiceModalContent, setPracticeModalContent] = useState<string | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessages = messagesByChannel[activeChannelId] || [];
  const currentChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text) return;

    const newMsgId = 'msg-' + Date.now();
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: newMsgId,
      senderName: 'Você',
      senderHandle: '@silviodombaxe',
      senderAvatar: SILVIO_AVATAR,
      isOutgoing: true,
      time: nowTime,
      content: text,
    };

    setMessagesByChannel((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), userMessage],
    }));

    setInputText('');

    // Check if user mentions AI tutor
    const lower = text.toLowerCase();
    const mentionsAi = lower.includes('@ai tutor') || lower.includes('@aitutor') || lower.startsWith('@ai');

    if (mentionsAi) {
      setTimeout(async () => {
        try {
          const res = await fetch('/api/channel-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, channel: activeChannelId }),
          });
          const data = await res.json();

          let tutorReply: ChatMessage;

          if (data?.aiReply?.text) {
            tutorReply = {
              id: 'ai-' + Date.now(),
              senderName: 'AI English Tutor',
              senderHandle: '@ai_tutor',
              senderAvatar: '',
              isAiBot: true,
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              content: data.aiReply.text,
              aiBreakdown: data.aiReply.correction
                ? {
                    title: 'Feedback Pontual',
                    originalText: data.aiReply.correction.wrong || text,
                    highlightedOriginal: data.aiReply.correction.wrong || text,
                    suggestedCorrection: data.aiReply.correction.right || 'Keep practicing!',
                    ruleExplanation: data.aiReply.correction.rule || 'Verifique a concordância gramatical.',
                    nativeAlternative: data.aiReply.correction.right || text,
                    audioPronunciationText: data.aiReply.correction.right || text,
                  }
                : undefined,
            };
          } else {
            // High quality pedagogical default reply
            tutorReply = {
              id: 'ai-' + Date.now(),
              senderName: 'AI English Tutor',
              senderHandle: '@ai_tutor',
              senderAvatar: '',
              isAiBot: true,
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              content: 'Excelente colocação! A sua estrutura está bem direcionada. Dica do Tutor: no inglês falado informal, você também pode usar contrações para soar ainda mais fluido.',
              aiBreakdown: {
                title: 'Dica do Tutor',
                originalText: text,
                highlightedOriginal: text,
                suggestedCorrection: text,
                ruleExplanation: 'Lembre-se sempre de manter a consistência de tempos verbais dentro do mesmo período.',
                nativeAlternative: text,
                audioPronunciationText: text,
              },
            };
          }

          setMessagesByChannel((prev) => ({
            ...prev,
            [activeChannelId]: [...(prev[activeChannelId] || []), tutorReply],
          }));
        } catch {
          // Fallback message
          const fallbackReply: ChatMessage = {
            id: 'ai-' + Date.now(),
            senderName: 'AI English Tutor',
            senderHandle: '@ai_tutor',
            senderAvatar: '',
            isAiBot: true,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            content: 'Ótima prática no canal! Continue enviando perguntas com @AI Tutor sempre que tiver dúvidas de vocabulário ou pronúncia.',
          };
          setMessagesByChannel((prev) => ({
            ...prev,
            [activeChannelId]: [...(prev[activeChannelId] || []), fallbackReply],
          }));
        }
      }, 700);
    }
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessagesByChannel((prev) => {
      const channelMsgs = prev[activeChannelId] || [];
      const updated = channelMsgs.map((m) => {
        if (m.id !== msgId) return m;
        const reactions = m.reactions ? [...m.reactions] : [];
        const existingIdx = reactions.findIndex((r) => r.emoji === emoji);
        if (existingIdx >= 0) {
          if (reactions[existingIdx].userReacted) {
            reactions[existingIdx].count = Math.max(1, reactions[existingIdx].count - 1);
            reactions[existingIdx].userReacted = false;
          } else {
            reactions[existingIdx].count += 1;
            reactions[existingIdx].userReacted = true;
          }
        } else {
          reactions.push({ emoji, count: 1, userReacted: true });
        }
        return { ...m, reactions };
      });
      return { ...prev, [activeChannelId]: updated };
    });
  };

  const handlePlayAudio = (id: string, textToPronounce: string) => {
    if (playingAudioId === id) {
      stopSpeaking();
      setPlayingAudioId(null);
      return;
    }
    setPlayingAudioId(id);
    speakEnglish(textToPronounce, () => {
      setPlayingAudioId(null);
    });
  };

  const handleQuickInsert = (template: string) => {
    setInputText((prev) => (prev ? `${prev} ${template}` : template));
  };

  const handleSimulateVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage('I would love to practice my presentation with the speaking pairs today!');
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col w-full relative min-h-[calc(100vh-64px)] pb-28">
      {/* Top Context & Quick Channel Switcher Bar */}
      <div className="px-4 py-2 bg-[#131b2e]/95 backdrop-blur-md shadow-sm sticky top-16 z-30 border-b border-[#434655]/20">
        <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
          {/* Channel Trigger Button */}
          <button
            onClick={() => setIsChannelDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#222a3d] hover:bg-[#2d3449] active:scale-95 transition-all text-[#dae2fd]"
            id="openChannelDrawerBtn"
          >
            <span className="text-[#ffb95f] font-headline-sm font-bold text-base">#</span>
            <span className="font-label-md text-sm text-[#dae2fd] tracking-tight font-semibold">
              {currentChannel.name}
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#c3c6d7]">
              expand_more
            </span>
          </button>

          {/* Channel Stats & Streak Target */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ee9800]/20 text-[#ffb95f] border border-[#ee9800]/30 shadow-sm">
              <span
                className="material-symbols-outlined text-[16px] text-[#ffb95f]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span className="font-label-sm text-xs font-bold">14 Dias</span>
            </div>

            <div className="flex items-center -space-x-2">
              <img
                alt="Teacher Éric"
                className="w-6 h-6 rounded-full object-cover shadow-sm ring-1 ring-[#131b2e]"
                src={TEACHER_ERIC_AVATAR}
              />
              <div className="w-6 h-6 rounded-full bg-[#2563eb] text-[#eeefff] flex items-center justify-center font-label-sm text-[10px] font-bold ring-1 ring-[#131b2e]">
                +28
              </div>
            </div>
          </div>
        </div>

        {/* Active Challenge / Topic Banner */}
        <div className="mt-2 p-2.5 rounded-xl bg-[#171f33] flex items-center justify-between gap-2 shadow-sm border border-[#434655]/20 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#ffb95f] text-[20px] shrink-0">
              lightbulb
            </span>
            <p className="font-body-sm text-xs sm:text-sm text-[#dae2fd] truncate">
              <strong className="font-semibold text-[#ffb95f]">Daily Prompt:</strong>{' '}
              "What would you do if you were fluent tomorrow?"
            </p>
          </div>
          <span className="font-label-sm text-[11px] text-[#4edea3] bg-[#007d55]/30 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 font-bold border border-[#4edea3]/20">
            B1-C1
          </span>
        </div>
      </div>

      {/* Messages Stream Area */}
      <div className="px-4 py-4 flex flex-col space-y-4 max-w-3xl mx-auto w-full flex-1">
        {/* Timestamp Divider */}
        <div className="flex items-center justify-center my-2">
          <span className="px-3 py-1 rounded-full bg-[#222a3d] text-[#c3c6d7] font-label-sm text-xs shadow-sm border border-[#434655]/20">
            Hoje, 15:42
          </span>
        </div>

        {/* Current Messages List */}
        {currentMessages.map((msg) => {
          if (msg.isOutgoing) {
            return (
              <div key={msg.id} className="flex flex-col items-end w-full pl-10 sm:pl-16">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-caption text-xs text-[#8d90a0]">{msg.time}</span>
                  <span className="font-label-sm text-xs text-[#dbe1ff] font-semibold">Você</span>
                </div>
                <div className="p-3.5 rounded-2xl rounded-tr-sm bg-[#2563eb] text-[#eeefff] font-body-md text-sm sm:text-base shadow-md leading-relaxed text-right">
                  {msg.content}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[#c3c6d7] font-caption text-[11px]">
                  <span>Entregue</span>
                  <span className="material-symbols-outlined text-[13px] text-[#4edea3]">
                    done_all
                  </span>
                </div>
              </div>
            );
          }

          if (msg.isAiBot) {
            return (
              <div key={msg.id} className="pl-6 sm:pl-10 flex flex-col w-full">
                <div className="p-4 rounded-2xl bg-[#222a3d] shadow-md relative overflow-hidden border border-[#434655]/40">
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#2563eb]"></div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#2563eb] text-[#eeefff] flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-label-md text-sm text-[#b4c5ff] font-bold">
                          AI English Tutor
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-[#b4c5ff]/20 text-[#b4c5ff] font-label-sm text-[10px] uppercase font-bold">
                          Bot IA
                        </span>
                      </div>
                    </div>
                    <span className="font-caption text-xs text-[#8d90a0]">Resposta Rápida</span>
                  </div>

                  <p className="font-body-sm text-sm text-[#dae2fd] mb-2">{msg.content}</p>

                  {msg.aiBreakdown && (
                    <div className="space-y-2 mt-2">
                      <div className="p-2.5 rounded-xl bg-[#060e20] text-[#c3c6d7] space-y-1.5 border border-[#434655]/30">
                        <div className="flex items-start gap-1.5 text-[#ffb4ab]">
                          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                            close
                          </span>
                          <span className="line-through text-xs font-mono">
                            "{msg.aiBreakdown.originalText}"
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5 text-[#4edea3]">
                          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span className="font-semibold text-xs font-mono">
                            "{msg.aiBreakdown.suggestedCorrection}"
                          </span>
                        </div>
                      </div>

                      <p className="text-[#c3c6d7] text-xs">
                        <strong className="text-[#ffb95f]">Regra:</strong> {msg.aiBreakdown.ruleExplanation}
                      </p>

                      {/* Native Pronunciation Player Snippet */}
                      <div className="mt-3 p-2 rounded-xl bg-[#171f33] flex items-center justify-between gap-2 border border-[#434655]/20">
                        <button
                          onClick={() =>
                            handlePlayAudio(
                              msg.id,
                              msg.aiBreakdown?.audioPronunciationText || msg.aiBreakdown?.suggestedCorrection || ''
                            )
                          }
                          className="w-8 h-8 rounded-full bg-[#b4c5ff] hover:bg-[#b4c5ff]/90 flex items-center justify-center text-[#002a78] active:scale-95 transition-transform shrink-0"
                          title="Ouvir pronúncia nativa"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {playingAudioId === msg.id ? 'pause' : 'volume_up'}
                          </span>
                        </button>

                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-center justify-between text-xs font-label-sm text-[#8d90a0] mb-1">
                            <span>Pronúncia Nativa</span>
                            <span>{playingAudioId === msg.id ? 'A reproduzir...' : '0:03'}</span>
                          </div>
                          {/* Animated Audio Bars */}
                          <div className="h-2 flex items-center gap-1">
                            <div className={`w-1 rounded bg-[#b4c5ff] transition-all ${playingAudioId === msg.id ? 'h-3 animate-pulse' : 'h-2'}`}></div>
                            <div className={`w-1 rounded bg-[#b4c5ff] transition-all ${playingAudioId === msg.id ? 'h-4 animate-bounce' : 'h-3'}`}></div>
                            <div className={`w-1 rounded bg-[#b4c5ff] transition-all ${playingAudioId === msg.id ? 'h-2.5 animate-pulse' : 'h-1.5'}`}></div>
                            <div className={`w-1 rounded bg-[#b4c5ff] transition-all ${playingAudioId === msg.id ? 'h-4 animate-bounce' : 'h-2.5'}`}></div>
                            <div className="w-1 h-2 rounded bg-[#434655]"></div>
                            <div className="w-1 h-1 rounded bg-[#434655]"></div>
                            <div className="w-1 h-3 rounded bg-[#434655]"></div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setPracticeModalContent(msg.aiBreakdown?.suggestedCorrection || 'Second Conditional');
                            setPracticeAnswer('');
                            setPracticeFeedback(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#2d3449] hover:bg-[#31394d] text-[#dae2fd] font-label-sm text-xs font-semibold"
                        >
                          Praticar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Normal Community Message (Silvio, Teacher Eric, Mariana, etc.)
          const isEric = msg.isMentor;
          return (
            <div key={msg.id} className="flex items-start gap-3 group">
              <button
                onClick={() => {
                  if (msg.senderName.includes('Silvio')) {
                    setSelectedMemberModal('silvio-dombaxe');
                  } else if (msg.isMentor) {
                    setSelectedMemberModal('teacher-eric');
                  } else {
                    setSelectedMemberModal('camila-santos');
                  }
                }}
                className="relative shrink-0 focus:outline-none"
                title={`Ver perfil de ${msg.senderName}`}
              >
                <img
                  className="w-10 h-10 rounded-full object-cover shadow-md ring-1 ring-[#434655]"
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#0b1326] ${
                    isEric ? 'bg-[#ffb95f]' : 'bg-[#4edea3]'
                  }`}
                ></span>
              </button>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <button
                    onClick={() => {
                      if (msg.senderName.includes('Silvio')) {
                        setSelectedMemberModal('silvio-dombaxe');
                      } else if (msg.isMentor) {
                        setSelectedMemberModal('teacher-eric');
                      } else {
                        setSelectedMemberModal('camila-santos');
                      }
                    }}
                    className={`font-label-md text-sm font-semibold hover:text-[#b4c5ff] transition-colors text-left flex items-center gap-1.5 ${
                      isEric ? 'text-[#ffb95f]' : 'text-[#dae2fd]'
                    }`}
                  >
                    {msg.senderName}
                    {isEric && (
                      <span
                        className="material-symbols-outlined text-[#ffb95f] text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    )}
                  </button>

                  {msg.senderLevel && (
                    <span className="px-2 py-0.5 rounded-full bg-[#222a3d] text-[#b4c5ff] font-label-sm text-[11px] font-medium border border-[#434655]/20">
                      {msg.senderLevel}
                    </span>
                  )}
                  {msg.senderBadge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#ee9800]/20 text-[#ffb95f] font-label-sm text-[11px] font-medium border border-[#ee9800]/30">
                      {msg.senderBadge}
                    </span>
                  )}
                  <span className="font-caption text-xs text-[#8d90a0]">{msg.time}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl rounded-tl-sm shadow-sm font-body-md text-sm sm:text-base leading-relaxed ${
                    isEric
                      ? 'bg-[#222a3d] text-[#dae2fd] border border-[#ffb95f]/30'
                      : 'bg-[#171f33] text-[#dae2fd] border border-[#434655]/20'
                  }`}
                >
                  {msg.content}
                  {msg.content.includes('@AI Tutor') && (
                    <button
                      onClick={() => {
                        if (onOpenTutorWithSentence) {
                          onOpenTutorWithSentence(
                            'If I were fluent tomorrow, I would definitely applying for foreign remote jobs immediately haha.'
                          );
                        }
                      }}
                      className="block mt-2 text-[#b4c5ff] hover:underline font-label-sm text-xs font-semibold"
                    >
                      @AI Tutor explain this sentence
                    </button>
                  )}
                </div>

                {/* Inline AI Breakdown Card if attached directly */}
                {msg.aiBreakdown && (
                  <div className="mt-3 flex flex-col">
                    <div className="p-4 rounded-2xl bg-[#222a3d] shadow-md relative overflow-hidden border border-[#434655]/30">
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#2563eb]"></div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#2563eb] text-[#eeefff] flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-label-md text-sm text-[#b4c5ff] font-bold">
                                AI English Tutor
                              </span>
                              <span className="px-1.5 py-0.2 rounded-full bg-[#b4c5ff]/20 text-[#b4c5ff] font-label-sm text-[10px] uppercase font-bold">
                                Bot IA
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="font-caption text-xs text-[#8d90a0]">Resposta Rápida</span>
                      </div>

                      <div className="font-body-sm text-xs sm:text-sm text-[#dae2fd] space-y-2">
                        <p>
                          Quase perfeito, Silvio! Há um pequeno detalhe na estrutura condicional do{' '}
                          <strong>Second Conditional</strong>:
                        </p>

                        <div className="p-2.5 rounded-xl bg-[#060e20] text-[#c3c6d7] space-y-1">
                          <div className="flex items-start gap-1.5 text-[#ffb4ab]">
                            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                              close
                            </span>
                            <span className="line-through text-xs font-mono">
                              "{msg.aiBreakdown.originalText}"
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5 text-[#4edea3]">
                            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                              check_circle
                            </span>
                            <span className="font-medium text-xs font-mono">
                              "{msg.aiBreakdown.suggestedCorrection}"
                            </span>
                          </div>
                        </div>

                        <p className="text-[#c3c6d7] font-caption text-xs">
                          <strong className="text-[#ffb95f]">Regra:</strong>{' '}
                          {msg.aiBreakdown.ruleExplanation}
                        </p>
                      </div>

                      {/* Native Audio Snippet */}
                      <div className="mt-3 p-2 rounded-xl bg-[#171f33] flex items-center justify-between gap-2 border border-[#434655]/20">
                        <button
                          onClick={() =>
                            handlePlayAudio(
                              'audio-' + msg.id,
                              msg.aiBreakdown?.audioPronunciationText || ''
                            )
                          }
                          className="w-8 h-8 rounded-full bg-[#b4c5ff] hover:bg-[#b4c5ff]/90 flex items-center justify-center text-[#002a78] active:scale-95 transition-transform shrink-0"
                          title="Tocar pronúncia"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {playingAudioId === 'audio-' + msg.id ? 'pause' : 'volume_up'}
                          </span>
                        </button>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-center justify-between text-xs font-label-sm text-[#8d90a0] mb-1">
                            <span>Pronúncia Nativa</span>
                            <span>{playingAudioId === 'audio-' + msg.id ? 'A reproduzir...' : '0:03'}</span>
                          </div>
                          <div className="h-2 flex items-center gap-0.5">
                            <div className="w-1 h-2 rounded bg-[#b4c5ff]"></div>
                            <div className="w-1 h-3 rounded bg-[#b4c5ff]"></div>
                            <div className="w-1 h-1.5 rounded bg-[#b4c5ff]"></div>
                            <div className="w-1 h-2.5 rounded bg-[#b4c5ff]"></div>
                            <div className="w-1 h-2 rounded bg-[#434655]"></div>
                            <div className="w-1 h-1 rounded bg-[#434655]"></div>
                            <div className="w-1 h-3 rounded bg-[#434655]"></div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setPracticeModalContent(msg.aiBreakdown?.suggestedCorrection || 'Second Conditional');
                            setPracticeAnswer('');
                            setPracticeFeedback(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#2d3449] hover:bg-[#31394d] text-[#dae2fd] font-label-sm text-xs font-semibold"
                        >
                          Praticar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reactions Bar */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {msg.reactions?.map((r) => (
                    <button
                      key={r.emoji}
                      onClick={() => handleToggleReaction(msg.id, r.emoji)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-transform active:scale-90 text-xs border ${
                        r.userReacted
                          ? 'bg-[#2563eb]/25 border-[#2563eb] text-[#b4c5ff]'
                          : 'bg-[#171f33] hover:bg-[#222a3d] border-[#434655]/30 text-[#c3c6d7]'
                      }`}
                    >
                      <span>{r.emoji}</span>
                      <span className="font-label-sm font-semibold">{r.count}</span>
                    </button>
                  ))}

                  <button
                    onClick={() => handleToggleReaction(msg.id, '❤️')}
                    className="w-6 h-6 rounded-full bg-[#171f33] hover:bg-[#222a3d] flex items-center justify-center text-[#c3c6d7] text-xs border border-[#434655]/20 active:scale-90 transition-transform"
                    title="Adicionar reação"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_reaction</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Channel Drawer Modal */}
      {isChannelDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-md flex items-end">
          <div className="w-full bg-[#131b2e] rounded-t-3xl p-4 shadow-2xl max-h-[80vh] overflow-y-auto border-t border-[#434655]/30 animate-in slide-in-from-bottom duration-200">
            <div className="w-10 h-1 bg-[#434655] rounded-full mx-auto mb-4"></div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline-sm text-lg text-[#dae2fd] font-bold">
                Canais da Comunidade
              </h2>
              <button
                className="p-2 rounded-full hover:bg-[#171f33] text-[#c3c6d7]"
                onClick={() => setIsChannelDrawerOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <p className="font-label-sm text-xs text-[#ffb95f] uppercase tracking-wider px-2 py-1 font-bold">
                Prática Ativa
              </p>
              {channels
                .filter((c) => c.category === 'Prática Ativa')
                .map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setActiveChannelId(channel.id);
                      setIsChannelDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                      activeChannelId === channel.id
                        ? 'bg-[#2563eb]/20 text-[#b4c5ff] font-semibold border border-[#2563eb]/30'
                        : 'hover:bg-[#171f33] text-[#c3c6d7] hover:text-[#dae2fd]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                      <span className="font-label-md text-sm"># {channel.name}</span>
                    </div>
                    {activeChannelId === channel.id ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#b4c5ff] text-[#002a78] font-label-sm text-xs font-bold">
                        Ativo
                      </span>
                    ) : (
                      channel.unreadCount && (
                        <span className="px-2 py-0.5 rounded-full bg-[#ee9800] text-[#000] font-label-sm text-xs font-bold">
                          {channel.unreadCount} novos
                        </span>
                      )
                    )}
                  </button>
                ))}

              <p className="font-label-sm text-xs text-[#ffb95f] uppercase tracking-wider px-2 pt-3 py-1 font-bold">
                Exclusivo Teacher Éric
              </p>
              {channels
                .filter((c) => c.category === 'Exclusivo Teacher Éric')
                .map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setActiveChannelId(channel.id);
                      setIsChannelDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                      activeChannelId === channel.id
                        ? 'bg-[#2563eb]/20 text-[#b4c5ff] font-semibold border border-[#2563eb]/30'
                        : 'hover:bg-[#171f33] text-[#c3c6d7] hover:text-[#dae2fd]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px]">campaign</span>
                      <span className="font-label-md text-sm"># {channel.name}</span>
                    </div>
                    {channel.isNew && (
                      <span className="px-2 py-0.5 rounded-full bg-[#ee9800]/20 text-[#ffb95f] font-label-sm text-xs font-bold border border-[#ee9800]/30">
                        Novo
                      </span>
                    )}
                  </button>
                ))}

              <p className="font-label-sm text-xs text-[#ffb95f] uppercase tracking-wider px-2 pt-3 py-1 font-bold">
                Salas de Áudio
              </p>
              {channels
                .filter((c) => c.category === 'Salas de Voz')
                .map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setActiveChannelId(channel.id);
                      setIsChannelDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                      activeChannelId === channel.id
                        ? 'bg-[#2563eb]/20 text-[#b4c5ff] font-semibold border border-[#2563eb]/30'
                        : 'hover:bg-[#171f33] text-[#c3c6d7] hover:text-[#dae2fd]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
                      <span className="font-label-md text-sm"># {channel.name}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Member Profile Modal (Silvio Dombaxe or other) */}
      {selectedMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060e20]/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#222a3d] p-5 shadow-2xl relative border border-[#434655]/40 animate-in fade-in zoom-in-95 duration-150">
            <button
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#171f33] flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd]"
              onClick={() => setSelectedMemberModal(null)}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            {/* Member Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative shrink-0">
                <img
                  className="w-16 h-16 rounded-full object-cover shadow-md ring-2 ring-[#2563eb]/30"
                  src={
                    selectedMemberModal === 'teacher-eric'
                      ? TEACHER_ERIC_AVATAR
                      : SILVIO_AVATAR
                  }
                  alt="Member"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#4edea3] ring-2 ring-[#222a3d]"></span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-headline-sm text-base font-bold text-[#dae2fd] truncate">
                  {selectedMemberModal === 'teacher-eric' ? 'Teacher Éric' : 'Silvio Dombaxe'}
                </h3>
                <p className="font-body-sm text-xs text-[#b4c5ff]">
                  {selectedMemberModal === 'teacher-eric' ? '@teachereric' : '@silviodombaxe'}
                </p>
                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-[#2563eb]/10 text-[#b4c5ff] font-label-sm text-xs font-semibold border border-[#2563eb]/20">
                    {selectedMemberModal === 'teacher-eric' ? '🇬🇧 Lead Coach' : '🇬🇧 Intermédio B2'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="font-body-sm text-xs sm:text-sm text-[#c3c6d7] mb-4 leading-normal">
              {selectedMemberModal === 'teacher-eric'
                ? 'Destravando sua confiança no inglês real com método conversacional e imersão ativa diária na comunidade.'
                : 'Tech lead focado em expansão internacional. Praticando conversação diária na comunidade do Teacher Éric para entrevistas no exterior. 🚀'}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-5 p-3 rounded-xl bg-[#171f33] border border-[#434655]/20">
              <div className="flex flex-col">
                <span className="font-caption text-xs text-[#8d90a0]">Dias Seguidos</span>
                <span className="font-headline-sm text-lg text-[#ffb95f] flex items-center gap-1 font-bold">
                  {selectedMemberModal === 'teacher-eric' ? '365' : '26'}
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-caption text-xs text-[#8d90a0]">Feedback IA</span>
                <span className="font-headline-sm text-lg text-[#4edea3] font-bold">94%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                className="flex-1 py-2.5 px-3 rounded-full bg-[#171f33] hover:bg-[#2d3449] text-[#dae2fd] font-label-md text-xs font-semibold text-center transition-all border border-[#434655]/20"
                onClick={() => {
                  setSelectedMemberModal(null);
                  onOpenMemberProfile(selectedMemberModal);
                }}
              >
                Ver perfil completo
              </button>
              <button
                className="flex-1 py-2.5 px-3 rounded-full bg-[#2563eb] text-[#eeefff] hover:bg-[#2563eb]/90 font-label-md text-xs font-semibold text-center shadow-sm transition-all flex items-center justify-center gap-1.5"
                onClick={() => {
                  const targetName = selectedMemberModal === 'teacher-eric' ? 'Teacher Éric' : 'Silvio';
                  setSelectedMemberModal(null);
                  setInputText(`Hi @${targetName}, could you give me some quick feedback on my speaking?`);
                }}
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Mensagem</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Practice Mini Challenge Modal */}
      {practiceModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060e20]/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#222a3d] p-5 shadow-2xl relative border border-[#434655]/30">
            <button
              onClick={() => setPracticeModalContent(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#171f33] flex items-center justify-center text-[#c3c6d7]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-2 text-[#ffb95f] mb-2">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              <h3 className="font-headline-sm text-base font-bold text-[#dae2fd]">
                Desafio Rápido de Fixação
              </h3>
            </div>

            <p className="font-body-sm text-xs sm:text-sm text-[#c3c6d7] mb-3">
              Como você diria: <span className="text-[#dae2fd] font-semibold">"Se eu ganhasse mais tempo livre, eu começaria a estudar piano hoje."</span>
            </p>

            <div className="space-y-2 mb-4">
              <textarea
                value={practiceAnswer}
                onChange={(e) => setPracticeAnswer(e.target.value)}
                placeholder="Escreva em inglês usando o Second Conditional..."
                rows={2}
                className="w-full p-3 rounded-xl bg-[#060e20] text-[#dae2fd] placeholder:text-[#8d90a0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
              {practiceFeedback && (
                <div className="p-3 rounded-xl bg-[#171f33] border border-[#4edea3]/30 text-xs text-[#dae2fd] flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#4edea3] text-[18px] shrink-0">
                    check_circle
                  </span>
                  <div>{practiceFeedback}</div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!practiceAnswer.trim()) {
                    setPracticeFeedback('Dica: "If I got more free time, I would start playing the piano today."');
                    return;
                  }
                  setPracticeFeedback('Correto! "If I got / had more free time, I would start..." Excelente uso do Second Conditional com base verbal!');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#2563eb] text-[#eeefff] font-label-md text-xs font-semibold shadow-md active:scale-95 transition-transform"
              >
                Verificar Resposta
              </button>
              <button
                onClick={() => setPracticeModalContent(null)}
                className="px-4 py-2.5 rounded-full bg-[#171f33] text-[#c3c6d7] font-label-md text-xs font-semibold"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="fixed bottom-16 inset-x-0 z-40 bg-[#131b2e]/95 backdrop-blur-xl p-3 border-t border-[#434655]/20 shadow-lg">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          {/* Quick Action / Tutor Prompt Trigger */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => handleQuickInsert('@AI Tutor explain: ')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563eb]/20 text-[#b4c5ff] hover:bg-[#2563eb]/30 transition-colors font-label-sm text-xs font-semibold shrink-0 border border-[#2563eb]/30"
              id="askAiPromptBtn"
            >
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              <span>@Perguntar à IA</span>
            </button>
            <button
              onClick={() => handleQuickInsert('How do I pronounce ')}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#171f33] hover:bg-[#222a3d] transition-colors font-label-sm text-xs text-[#c3c6d7] shrink-0 border border-[#434655]/20"
            >
              <span>🗣️ Como pronunciar...</span>
            </button>
            <button
              onClick={() => handleQuickInsert('Is this sentence natural: ')}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#171f33] hover:bg-[#222a3d] transition-colors font-label-sm text-xs text-[#c3c6d7] shrink-0 border border-[#434655]/20"
            >
              <span>✍️ Frase natural?</span>
            </button>
          </div>

          {/* Input control deck */}
          <div className="flex items-center gap-2">
            {/* Tools */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                aria-label="Anexar Imagem"
                onClick={() => alert('Anexo de foto: você pode tirar fotos do seu caderno ou livro de inglês para o AI Tutor corrigir!')}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#171f33] transition-colors"
                title="Anexar imagem de exercício"
              >
                <span className="material-symbols-outlined text-[22px]">add_photo_alternate</span>
              </button>
              <button
                aria-label="Gravar Áudio"
                onClick={handleSimulateVoice}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${
                  isRecording
                    ? 'text-[#ffb95f] bg-[#ee9800]/20 animate-pulse ring-2 ring-[#ffb95f]'
                    : 'text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#171f33]'
                }`}
                title="Gravar áudio"
              >
                <span className="material-symbols-outlined text-[22px]">mic</span>
              </button>
            </div>

            {/* Main Input Field */}
            <div className="flex-1 relative flex items-center min-w-0">
              <input
                id="chatInput"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder={isRecording ? 'Gravando áudio em inglês...' : 'Write in English only...'}
                className="w-full bg-[#171f33] text-[#dae2fd] placeholder:text-[#8d90a0] text-sm py-2.5 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2563eb] shadow-inner border border-[#434655]/20"
              />
              <button
                onClick={() => setInputText((prev) => prev + ' 🚀')}
                aria-label="Emoji Picker"
                className="absolute right-2.5 w-7 h-7 flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd]"
              >
                <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
              </button>
            </div>

            {/* Send Button */}
            <button
              id="sendMessageBtn"
              aria-label="Enviar Mensagem"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() && !isRecording}
              className="w-10 h-10 rounded-full bg-[#2563eb] text-[#eeefff] flex items-center justify-center shadow-md active:scale-90 transition-transform shrink-0 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
