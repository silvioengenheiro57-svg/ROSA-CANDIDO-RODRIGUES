import React from 'react';
import { TEACHER_ERIC_AVATAR } from '../data/mockData';

interface LandingPageProps {
  onEnterCommunity: () => void;
  onOpenAiTutor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterCommunity,
  onOpenAiTutor,
}) => {
  return (
    <div className="flex flex-col w-full pb-28 bg-[#0b1326] text-[#dae2fd]">
      {/* Hero Section */}
      <section className="relative px-4 pt-6 pb-8 flex flex-col items-center text-center overflow-hidden max-w-xl mx-auto">
        {/* Ambient Radial Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#2563eb]/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Badge Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#222a3d] shadow-sm text-[#b4c5ff] mb-4 border border-[#434655]/30">
          <span className="text-sm">🇬🇧</span>
          <span className="font-label-sm text-xs tracking-wide uppercase text-[#dae2fd] font-bold">
            A Nova Maneira de Dominar o Inglês
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-headline-lg-mobile text-2xl sm:text-3xl md:text-4xl text-[#dae2fd] tracking-tight max-w-md mb-2 font-extrabold leading-tight">
          Bem-vindo à Comunidade <span className="text-[#b4c5ff]">Teacher Éric</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body-md text-xs sm:text-sm text-[#c3c6d7] max-w-sm mb-6 leading-relaxed">
          Um espaço para aprender inglês, praticar, conversar e evoluir junto com a comunidade.
        </p>

        {/* Mentor Hero Spotlight Card */}
        <div className="relative flex flex-col items-center mb-6">
          {/* Outer Pulsing Ring */}
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#2563eb] via-[#b4c5ff] to-[#ee9800] shadow-xl">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-[#171f33] p-0.5">
              <img
                alt="Teacher Éric - Fundador e Mentor"
                className="w-full h-full object-cover rounded-full"
                src={TEACHER_ERIC_AVATAR}
              />
            </div>
            {/* Live Dot Badge */}
            <div className="absolute bottom-1 right-2 bg-[#060e20] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1.5 border border-[#434655]/40">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
              <span className="font-caption text-xs text-[#4edea3] font-semibold">Ao vivo</span>
            </div>
          </div>

          {/* Founder Verified Pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#171f33] shadow-sm border border-[#ee9800]/30">
            <span
              className="material-symbols-outlined text-[16px] text-[#ffb95f]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="font-label-sm text-xs text-[#dae2fd] font-semibold">
              Teacher Éric • Fundador & Mentor Oficial
            </span>
          </div>
        </div>

        {/* Primary & Secondary CTA Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-2.5 items-stretch max-w-xs">
          <button
            onClick={onEnterCommunity}
            className="h-12 px-6 rounded-full bg-[#2563eb] text-[#eeefff] hover:bg-[#2563eb]/90 font-label-md text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-lg shadow-[#2563eb]/25 active:scale-95 transition-transform"
          >
            <span>Entrar na comunidade</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <button
            onClick={onOpenAiTutor}
            className="h-12 px-6 rounded-full bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] font-label-md text-xs sm:text-sm font-semibold inline-flex items-center justify-center shadow-sm active:scale-95 transition-transform border border-[#434655]/30"
          >
            <span>Testar AI Tutor Grátis</span>
          </button>
        </div>

        {/* Micro Proof Counter */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[#c3c6d7]">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-6 w-6 rounded-full bg-[#31394d] flex items-center justify-center text-[10px] text-[#dae2fd] font-bold ring-1 ring-[#0b1326]">
              JD
            </div>
            <div className="inline-block h-6 w-6 rounded-full bg-[#2563eb]/40 flex items-center justify-center text-[10px] text-[#b4c5ff] font-bold ring-1 ring-[#0b1326]">
              MS
            </div>
            <div className="inline-block h-6 w-6 rounded-full bg-[#ee9800]/40 flex items-center justify-center text-[10px] text-[#ffb95f] font-bold ring-1 ring-[#0b1326]">
              AL
            </div>
          </div>
          <span className="font-caption text-xs font-medium">+540 membros praticando hoje</span>
        </div>
      </section>

      {/* Community Sneak Peek Section */}
      <section className="px-4 mb-8 max-w-xl mx-auto w-full">
        <div className="text-center mb-3">
          <span className="font-label-sm text-xs uppercase tracking-wider text-[#b4c5ff] font-bold">
            Preview Exclusivo
          </span>
          <h2 className="font-headline-sm text-lg sm:text-xl text-[#dae2fd] mt-1 font-bold">
            Espreite por dentro da plataforma
          </h2>
        </div>

        {/* Mockup Container */}
        <div
          onClick={onEnterCommunity}
          className="cursor-pointer w-full bg-[#131b2e] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 border border-[#434655]/30 hover:border-[#2563eb]/40 transition-all"
        >
          {/* Mockup Header */}
          <div className="flex items-center justify-between pb-2 bg-[#171f33] px-3 py-1.5 rounded-full border border-[#434655]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#b4c5ff]">tag</span>
              <span className="font-label-md text-xs sm:text-sm font-semibold text-[#dae2fd]">
                english-only
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="font-caption text-xs text-[#4edea3]">28 online agora</span>
            </div>
          </div>

          {/* Quick Ribbon */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-nowrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#2563eb] text-[#eeefff] font-caption text-[11px] font-semibold">
              #english-only
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#222a3d] text-[#c3c6d7] font-caption text-[11px]">
              #ai-tutor
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#222a3d] text-[#c3c6d7] font-caption text-[11px]">
              #speaking-rooms
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#222a3d] text-[#c3c6d7] font-caption text-[11px]">
              #vocabulary
            </span>
          </div>

          {/* Mini-feed mockup */}
          <div className="flex flex-col gap-2">
            {/* Student query */}
            <div className="flex items-start gap-2 bg-[#171f33] p-2.5 rounded-xl border border-[#434655]/20">
              <div className="w-8 h-8 rounded-full bg-[#31394d] flex items-center justify-center font-label-sm text-xs text-[#dae2fd] shrink-0 font-bold">
                RA
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-xs font-semibold text-[#dae2fd]">
                    Rodrigo Alves
                  </span>
                  <span className="font-caption text-[11px] text-[#8d90a0]">14:02</span>
                </div>
                <p className="font-body-sm text-xs text-[#c3c6d7] mt-0.5">
                  Is this sentence natural? <span className="text-[#b4c5ff] font-medium">@AI Tutor</span> "I look forward to hear from you soon."
                </p>
              </div>
            </div>

            {/* AI Bot Response */}
            <div className="flex items-start gap-2 bg-[#222a3d] p-2.5 rounded-xl border border-[#2563eb]/30">
              <div className="w-8 h-8 rounded-full bg-[#007d55] flex items-center justify-center text-[#bdffdb] shrink-0">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-xs font-bold text-[#dae2fd]">
                    AI English Tutor
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#2563eb]/20 text-[#b4c5ff] rounded font-label-sm text-[10px] font-bold">
                    AI BOT
                  </span>
                </div>
                <p className="font-body-sm text-xs text-[#dae2fd] mt-0.5 leading-relaxed">
                  Quase perfeito, Rodrigo! O correto é:{' '}
                  <strong className="text-[#4edea3]">"I look forward to hearing from you soon"</strong>{' '}
                  (usamos -ing após 'look forward to').
                </p>
              </div>
            </div>

            {/* Teacher Eric feedback */}
            <div className="flex items-start gap-2 bg-[#2563eb]/15 p-2.5 rounded-xl border border-[#2563eb]/30">
              <img
                src={TEACHER_ERIC_AVATAR}
                alt="Teacher Éric"
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#ffb95f]"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-xs font-bold text-[#b4c5ff]">
                    Teacher Éric
                  </span>
                  <span
                    className="material-symbols-outlined text-[14px] text-[#ffb95f]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <p className="font-body-sm text-xs text-[#dae2fd] mt-0.5">
                  Exato! Regra de ouro para emails de negócios. Parabéns pela iniciativa! 🚀
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-1 flex items-center justify-between text-[#8d90a0] font-caption text-xs">
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#ffb95f]">
                local_fire_department
              </span>
              Streak Diário Ativo
            </span>
            <span className="text-[#b4c5ff] font-medium">Toque para interagir na comunidade</span>
          </div>
        </div>
      </section>

      {/* Features Grid: 'Tudo o que precisas num só lugar' */}
      <section className="px-4 mb-8 max-w-xl mx-auto w-full">
        <div className="mb-4 text-left">
          <span className="font-label-sm text-xs uppercase tracking-wider text-[#ffb95f] font-bold">
            Recursos Essenciais
          </span>
          <h2 className="font-headline-sm text-lg sm:text-xl text-[#dae2fd] mt-1 font-bold">
            Tudo o que precisas num só lugar
          </h2>
          <p className="font-body-sm text-xs sm:text-sm text-[#c3c6d7] mt-1 leading-relaxed">
            Uma experiência imersiva desenhada para destravar a sua comunicação com autonomia e confiança.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {[
            {
              title: 'Comunidade Ativa',
              desc: 'Ambiente seguro e ativo sem medo de errar, com alunos no mesmo nível e propósito diário de evolução.',
              icon: 'forum',
              color: 'text-[#b4c5ff] bg-[#2563eb]/20',
            },
            {
              title: 'Aprendizagem Direcionada',
              desc: 'Recursos dinâmicos divididos por gramática prática, vocabulário contextuado e expressões do dia a dia.',
              icon: 'auto_stories',
              color: 'text-[#ffb95f] bg-[#ee9800]/20',
            },
            {
              title: 'Prática de Fala Real',
              desc: 'Canais de áudio e duplas de conversação guiadas de 15 minutos para destravar a dicção sem pressão.',
              icon: 'record_voice_over',
              color: 'text-[#4edea3] bg-[#007d55]/30',
            },
            {
              title: 'AI English Tutor 24/7',
              desc: 'Assistente inteligente integrado aos canais para tirar dúvidas em tempo real e corrigir frases na hora.',
              icon: 'smart_toy',
              color: 'text-[#b4c5ff] bg-[#2563eb]/20',
            },
            {
              title: 'Networking Global',
              desc: 'Conecte-se com profissionais de tecnologia, design e negócios internacionais em transição de carreira.',
              icon: 'groups',
              color: 'text-[#ffb95f] bg-[#ee9800]/20',
            },
            {
              title: 'Evolução Tangível',
              desc: 'Acompanhe seu streak, minutos de conversação acumulados e suba de nível com conquistas de fluência.',
              icon: 'trending_up',
              color: 'text-[#4edea3] bg-[#007d55]/30',
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#171f33] p-4 rounded-2xl flex items-start gap-3.5 shadow-sm border border-[#434655]/20"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${feat.color}`}
              >
                <span className="material-symbols-outlined text-[22px]">{feat.icon}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="font-headline-sm text-sm sm:text-base font-bold text-[#dae2fd]">
                  {feat.title}
                </h3>
                <p className="font-body-sm text-xs sm:text-sm text-[#c3c6d7] mt-0.5 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof & Testimonial Section */}
      <section className="px-4 mb-6 max-w-xl mx-auto w-full">
        <div className="bg-[#222a3d] p-5 rounded-2xl shadow-lg flex flex-col gap-3 border border-[#434655]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[#ffb95f]">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-headline-sm text-sm font-bold text-[#dae2fd] ml-1">4.9/5</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#2d3449] text-[#c3c6d7] font-caption text-xs font-semibold">
              Alunos Ativos
            </span>
          </div>

          <blockquote className="font-body-lg text-xs sm:text-sm text-[#dae2fd] italic leading-relaxed">
            "Pela primeira vez sinto que pratico inglês de verdade todos os dias. O suporte do Teacher Éric e a inteligência nos canais deram o ritmo que nenhum app tradicional conseguiu."
          </blockquote>

          <div className="flex items-center gap-2.5 pt-1 border-t border-[#434655]/20">
            <div className="w-9 h-9 rounded-full bg-[#2563eb] text-[#eeefff] flex items-center justify-center font-label-md text-xs font-bold">
              CP
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-xs sm:text-sm text-[#dae2fd] font-semibold">
                Camila Prado
              </span>
              <span className="font-caption text-xs text-[#8d90a0]">
                Product Manager • Membro há 6 meses
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Final Onboarding Push Card */}
      <section className="px-4 mb-4 max-w-xl mx-auto w-full">
        <div className="bg-gradient-to-br from-[#2563eb]/25 via-[#171f33] to-[#171f33] p-5 rounded-2xl flex flex-col items-center text-center gap-2 border border-[#2563eb]/30">
          <span className="material-symbols-outlined text-[32px] text-[#b4c5ff]">rocket_launch</span>
          <h3 className="font-headline-sm text-base sm:text-lg font-bold text-[#dae2fd]">
            Pronto para dar o próximo passo?
          </h3>
          <p className="font-body-sm text-xs sm:text-sm text-[#c3c6d7] max-w-xs">
            Junte-se a centenas de falantes em desenvolvimento contínuo. Sua primeira conversa começa hoje.
          </p>
          <button
            onClick={onEnterCommunity}
            className="w-full mt-2 h-11 rounded-full bg-[#2563eb] hover:bg-[#2563eb]/90 text-[#eeefff] font-label-md text-xs sm:text-sm font-semibold inline-flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            Começar Agora
          </button>
        </div>
      </section>

      {/* Floating Bottom CTA Bar */}
      <aside className="fixed bottom-0 inset-x-0 p-3 bg-[#0b1326]/95 backdrop-blur-md shadow-2xl z-40 flex items-center justify-between gap-2 max-w-md mx-auto border-t border-[#434655]/30">
        <div className="flex flex-col pl-2">
          <span className="font-label-sm text-xs font-bold text-[#dae2fd]">Acesso Imediato</span>
          <span className="font-caption text-xs text-[#4edea3] font-semibold">Comunidade Aberta</span>
        </div>
        <button
          onClick={onEnterCommunity}
          className="h-10 px-5 rounded-full bg-[#2563eb] hover:bg-[#2563eb]/90 text-[#eeefff] font-label-md text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
        >
          <span>Garantir Acesso</span>
          <span className="material-symbols-outlined text-[16px]">bolt</span>
        </button>
      </aside>
    </div>
  );
};
