import React, { useState } from 'react';
import { SILVIO_AVATAR, PROFILE_BANNER } from '../data/mockData';

export const ProfileTab: React.FC = () => {
  const [name, setName] = useState('Silvio Dombaxe');
  const [handle, setHandle] = useState('@silviodombaxe');
  const [shortPitch, setShortPitch] = useState('Estudante de TI | Aprendendo inglês | Interessado em tecnologia e IA');
  const [fullBio, setFullBio] = useState('Sou estudante de tecnologia e estou a aprender inglês para melhorar as minhas oportunidades profissionais. Gosto de tecnologia, programação e Inteligência Artificial. Procuro praticar speaking com membros da comunidade.');
  const [level, setLevel] = useState('Intermédio (B1-B2)');
  const [goal, setGoal] = useState('Entrevistas internacionais e trabalho remoto');
  const [isEditing, setIsEditing] = useState(false);
  const [isCopiedShare, setIsCopiedShare] = useState(false);
  const [invitedSpeakingPair, setInvitedSpeakingPair] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Silvio Dombaxe - Teacher Éric Community',
          text: 'Confira o perfil de Silvio Dombaxe na comunidade de inglês do Teacher Éric!',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      setIsCopiedShare(true);
      navigator.clipboard?.writeText(window.location.href);
      setTimeout(() => setIsCopiedShare(false), 2000);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-3xl mx-auto min-h-[calc(100vh-64px)]">
      {/* Profile Hero Header Banner */}
      <div className="relative w-full">
        {/* Atmospheric Cover Image */}
        <div
          className="w-full h-44 bg-cover bg-center relative"
          style={{ backgroundImage: `url('${PROFILE_BANNER}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1326]/20 via-[#0b1326]/60 to-[#0b1326]"></div>

          {/* Top Actions Over Banner */}
          <div className="absolute top-3 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-[#222a3d]/80 backdrop-blur-md text-[#dae2fd] flex items-center justify-center shadow-md active:scale-95 transition-all border border-[#434655]/40"
              id="shareProfileBtn"
              title="Compartilhar perfil"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isCopiedShare ? 'done' : 'share'}
              </span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="w-10 h-10 rounded-full bg-[#222a3d]/80 backdrop-blur-md text-[#dae2fd] flex items-center justify-center shadow-md active:scale-95 transition-all border border-[#434655]/40"
              title="Configurações do perfil"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          </div>
        </div>

        {/* Avatar & Main Meta (Overlapping) */}
        <div className="px-4 -mt-16 flex flex-col relative z-10">
          <div className="flex items-end justify-between">
            {/* Avatar Wrapper */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl bg-[#222a3d] ring-4 ring-[#0b1326]">
                <img
                  className="w-full h-full object-cover"
                  src={SILVIO_AVATAR}
                  alt={name}
                />
              </div>
              {/* Online Status Badge */}
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#060e20] flex items-center justify-center shadow-sm">
                <span className="w-3.5 h-3.5 rounded-full bg-[#4edea3] animate-pulse" title="Online Agora"></span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="h-10 px-5 rounded-full bg-[#2563eb] text-[#eeefff] hover:bg-[#2563eb]/90 font-label-md text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span>Editar Perfil</span>
            </button>
          </div>

          {/* Identity Details */}
          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight">
                {name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#2563eb]/20 text-[#b4c5ff] font-label-sm text-xs font-semibold flex items-center gap-1 border border-[#2563eb]/30">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                PRO Member
              </span>
            </div>
            <p className="font-label-md text-xs sm:text-sm text-[#c3c6d7] mt-0.5">{handle}</p>
          </div>

          {/* Micro Pitch / Short Presentation */}
          <div className="mt-3 p-3 rounded-2xl bg-[#131b2e] shadow-sm border border-[#434655]/20">
            <p className="font-body-sm text-xs sm:text-sm text-[#dae2fd] flex items-center gap-1.5 flex-wrap">
              <span className="material-symbols-outlined text-[16px] text-[#b4c5ff]">terminal</span>
              <span className="font-semibold text-[#b4c5ff]">Apresentação Curta:</span>
              <span>{shortPitch}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4 mt-4">
        {/* Key Community Metrics Bento Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Streak */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#171f33] shadow-sm text-center border border-[#ee9800]/20">
            <div className="w-8 h-8 rounded-full bg-[#ee9800]/20 flex items-center justify-center mb-1 text-[#ffb95f]">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>
            <span className="font-headline-sm text-lg sm:text-xl font-bold text-[#ffb95f] leading-none">
              14
            </span>
            <span className="font-caption text-[11px] text-[#c3c6d7] mt-1">Dias de Streak</span>
          </div>

          {/* XP Practice */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#171f33] shadow-sm text-center border border-[#2563eb]/20">
            <div className="w-8 h-8 rounded-full bg-[#2563eb]/20 flex items-center justify-center mb-1 text-[#b4c5ff]">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <span className="font-headline-sm text-lg sm:text-xl font-bold text-[#b4c5ff] leading-none">
              420
            </span>
            <span className="font-caption text-[11px] text-[#c3c6d7] mt-1">XP de Prática</span>
          </div>

          {/* Community Interventions */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#171f33] shadow-sm text-center border border-[#4edea3]/20">
            <div className="w-8 h-8 rounded-full bg-[#007d55]/30 flex items-center justify-center mb-1 text-[#4edea3]">
              <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
            </div>
            <span className="font-headline-sm text-lg sm:text-xl font-bold text-[#4edea3] leading-none">
              15
            </span>
            <span className="font-caption text-[11px] text-[#c3c6d7] mt-1">Falou em Voz</span>
          </div>
        </div>

        {/* Ficha de Aprendizagem */}
        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#171f33] shadow-sm border border-[#434655]/20">
          <div className="flex items-center gap-2 text-[#c3c6d7] mb-1">
            <span className="material-symbols-outlined text-[18px] text-[#b4c5ff]">shield_person</span>
            <span className="font-label-sm text-xs uppercase tracking-wider font-bold">
              Ficha de Aprendizagem
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Nível */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#222a3d]/60 border border-[#434655]/20">
              <div className="flex items-center gap-2.5">
                <span className="text-base">🇬🇧</span>
                <span className="font-body-sm text-xs sm:text-sm text-[#dae2fd] font-medium">Nível Atual</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#2563eb]/25 text-[#b4c5ff] font-label-sm text-xs font-semibold uppercase border border-[#2563eb]/30">
                {level}
              </span>
            </div>

            {/* Objetivo */}
            <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-[#222a3d]/60 border border-[#434655]/20">
              <div className="flex items-center gap-2">
                <span className="text-base">🎯</span>
                <span className="font-body-sm text-xs sm:text-sm text-[#dae2fd] font-medium">Objetivo Principal</span>
              </div>
              <p className="font-body-sm text-xs text-[#c3c6d7] pl-6">{goal}</p>
            </div>

            {/* Membro Desde */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#222a3d]/60 border border-[#434655]/20">
              <div className="flex items-center gap-2.5">
                <span className="text-base">📅</span>
                <span className="font-body-sm text-xs sm:text-sm text-[#dae2fd] font-medium">
                  Membro da Comunidade
                </span>
              </div>
              <span className="font-label-sm text-xs text-[#c3c6d7]">Desde Janeiro 2024</span>
            </div>
          </div>
        </div>

        {/* Full Description / About Section */}
        <div className="flex flex-col p-4 rounded-2xl bg-[#171f33] shadow-sm border border-[#434655]/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#ffb95f]">notes</span>
              <h3 className="font-headline-sm text-base font-bold text-[#dae2fd]">Descrição Completa</h3>
            </div>
            <span className="font-caption text-xs text-[#c3c6d7]">Bio Pessoal</span>
          </div>

          <p className="font-body-md text-xs sm:text-sm text-[#dae2fd] leading-relaxed">
            {fullBio}
          </p>

          {/* Speaking Availability Callout */}
          <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-[#131b2e] border border-[#4edea3]/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#007d55]/30 text-[#4edea3] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </div>
              <div>
                <p className="font-label-md text-xs sm:text-sm font-semibold text-[#dae2fd]">
                  Aberto a Speaking Pairs
                </p>
                <p className="font-caption text-[11px] text-[#c3c6d7]">
                  Disponível para chamadas de 15min
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setInvitedSpeakingPair(true);
                setTimeout(() => setInvitedSpeakingPair(false), 2500);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#4edea3] hover:bg-[#4edea3]/90 text-[#003824] font-label-sm text-xs font-bold active:scale-95 transition-all shadow-sm"
            >
              {invitedSpeakingPair ? 'Disponível ✅' : 'Convidar'}
            </button>
          </div>
        </div>

        {/* Canais Mais Ativos */}
        <div className="flex flex-col p-4 rounded-2xl bg-[#171f33] shadow-sm border border-[#434655]/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#b4c5ff]">tag</span>
              <h3 className="font-headline-sm text-base font-bold text-[#dae2fd]">Canais Mais Ativos</h3>
            </div>
            <span className="font-caption text-xs text-[#c3c6d7]">Top 3 Frequência</span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Canal 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131b2e] hover:bg-[#222a3d] transition-colors border border-[#434655]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2d3449] flex items-center justify-center text-[#dae2fd] font-label-md text-sm font-bold">
                  #
                </div>
                <div>
                  <p className="font-label-md text-xs sm:text-sm font-semibold text-[#dae2fd]">english-only</p>
                  <p className="font-caption text-[11px] text-[#c3c6d7]">
                    15 intervenções de voz & debate
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#c3c6d7]">chevron_right</span>
            </div>

            {/* Canal 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131b2e] hover:bg-[#222a3d] transition-colors border border-[#434655]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2d3449] flex items-center justify-center text-[#b4c5ff]">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                </div>
                <div>
                  <p className="font-label-md text-xs sm:text-sm font-semibold text-[#dae2fd]">ai-tutor</p>
                  <p className="font-caption text-[11px] text-[#c3c6d7]">
                    Prática diária de gramática tech
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#c3c6d7]">chevron_right</span>
            </div>

            {/* Canal 3 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#131b2e] hover:bg-[#222a3d] transition-colors border border-[#434655]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2d3449] flex items-center justify-center text-[#ffb95f]">
                  <span className="material-symbols-outlined text-[16px]">headset_mic</span>
                </div>
                <div>
                  <p className="font-label-md text-xs sm:text-sm font-semibold text-[#dae2fd]">study-room</p>
                  <p className="font-caption text-[11px] text-[#c3c6d7]">Sessões de foco e coworking</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#c3c6d7]">chevron_right</span>
            </div>
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="flex flex-col p-4 rounded-2xl bg-[#171f33] shadow-sm border border-[#434655]/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#4edea3]">history</span>
              <h3 className="font-headline-sm text-base font-bold text-[#dae2fd]">Atividade Recente</h3>
            </div>
            <span className="font-caption text-xs text-[#4edea3] flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              Tempo Real
            </span>
          </div>

          {/* Feed Timeline */}
          <div className="flex flex-col gap-3">
            {/* Item 1 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#ee9800]/20 text-[#ffb95f] flex items-center justify-center border border-[#ee9800]/30">
                  <span className="material-symbols-outlined text-[16px]">campaign</span>
                </div>
                <div className="w-0.5 flex-1 bg-[#2d3449] my-1"></div>
              </div>
              <div className="flex flex-col flex-1 pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-xs text-[#dae2fd] font-bold">
                    Mensagem no #english-only
                  </span>
                  <span className="font-caption text-[11px] text-[#8d90a0]">Há 45 min</span>
                </div>
                <p className="font-body-sm text-xs sm:text-sm text-[#c3c6d7] mt-0.5 leading-relaxed">
                  "Just finished refactoring a Python script using async features. Does anyone have feedback on how to explain concurrency in a job interview?"
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#2563eb]/20 text-[#b4c5ff] flex items-center justify-center border border-[#2563eb]/30">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                </div>
                <div className="w-0.5 flex-1 bg-[#2d3449] my-1"></div>
              </div>
              <div className="flex flex-col flex-1 pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-xs text-[#dae2fd] font-bold">
                    Simulação com AI Tutor
                  </span>
                  <span className="font-caption text-[11px] text-[#8d90a0]">Hoje, 09:20</span>
                </div>
                <p className="font-body-sm text-xs sm:text-sm text-[#c3c6d7] mt-0.5">
                  Praticou: <span className="text-[#dae2fd] font-medium">Technical Job Interview Warmup</span> (+35 XP conquistados).
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#007d55]/30 text-[#4edea3] flex items-center justify-center border border-[#4edea3]/30">
                  <span className="material-symbols-outlined text-[16px]">hotel_class</span>
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-xs text-[#dae2fd] font-bold">
                    Marco de Frequência
                  </span>
                  <span className="font-caption text-[11px] text-[#8d90a0]">Ontem</span>
                </div>
                <p className="font-body-sm text-xs sm:text-sm text-[#c3c6d7] mt-0.5">
                  Atingiu 14 dias seguidos no desafio diário de pronúncia do Teacher Éric!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060e20]/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#222a3d] p-5 shadow-2xl relative border border-[#434655]/40 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-base font-bold text-[#dae2fd]">
                Editar Perfil do Aluno
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-[#171f33] flex items-center justify-center text-[#c3c6d7]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-label-sm text-[#c3c6d7] block mb-1 font-semibold">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131b2e] text-[#dae2fd] text-sm p-2.5 rounded-xl border border-[#434655]/30 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="text-xs font-label-sm text-[#c3c6d7] block mb-1 font-semibold">
                  Handle
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-[#131b2e] text-[#dae2fd] text-sm p-2.5 rounded-xl border border-[#434655]/30 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="text-xs font-label-sm text-[#c3c6d7] block mb-1 font-semibold">
                  Apresentação Curta
                </label>
                <input
                  type="text"
                  value={shortPitch}
                  onChange={(e) => setShortPitch(e.target.value)}
                  className="w-full bg-[#131b2e] text-[#dae2fd] text-sm p-2.5 rounded-xl border border-[#434655]/30 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="text-xs font-label-sm text-[#c3c6d7] block mb-1 font-semibold">
                  Nível Atual
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-[#131b2e] text-[#dae2fd] text-sm p-2.5 rounded-xl border border-[#434655]/30 focus:outline-none focus:border-[#2563eb]"
                >
                  <option value="Iniciante (A1)">Iniciante (A1)</option>
                  <option value="Básico (A2)">Básico (A2)</option>
                  <option value="Intermédio (B1-B2)">Intermédio (B1-B2)</option>
                  <option value="Avançado (C1-C2)">Avançado (C1-C2)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-label-sm text-[#c3c6d7] block mb-1 font-semibold">
                  Objetivo Principal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-[#131b2e] text-[#dae2fd] text-sm p-2.5 rounded-xl border border-[#434655]/30 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="text-xs font-label-sm text-[#c3c6d7] block mb-1 font-semibold">
                  Descrição Completa
                </label>
                <textarea
                  rows={3}
                  value={fullBio}
                  onChange={(e) => setFullBio(e.target.value)}
                  className="w-full bg-[#131b2e] text-[#dae2fd] text-sm p-2.5 rounded-xl border border-[#434655]/30 focus:outline-none focus:border-[#2563eb] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#171f33] text-[#c3c6d7] font-label-md text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#2563eb] text-[#eeefff] font-label-md text-xs font-semibold shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
