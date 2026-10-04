import React, { useState } from 'react';
import { Member } from '../types';
import { MEMBERS, TEACHER_ERIC_AVATAR } from '../data/mockData';

interface MembersTabProps {
  onOpenDirectChat?: (member: Member) => void;
  onOpenProfileTab?: (memberId: string) => void;
}

export const MembersTab: React.FC<MembersTabProps> = ({
  onOpenDirectChat,
  onOpenProfileTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'iniciante' | 'basico' | 'intermedio' | 'avancado'>('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [previewMember, setPreviewMember] = useState<Member | null>(null);

  const mentor = MEMBERS.find((m) => m.isMentor) || MEMBERS[0];
  const regularMembers = MEMBERS.filter((m) => !m.isMentor);

  const filteredMembers = regularMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      selectedLevel === 'all' || m.levelCategory === selectedLevel;

    const matchesOnline = !showOnlineOnly || m.online;

    return matchesSearch && matchesLevel && matchesOnline;
  });

  return (
    <div className="flex flex-col w-full pb-28 max-w-3xl mx-auto min-h-[calc(100vh-64px)] px-4">
      {/* Search & Filter Header */}
      <div className="pt-3 pb-4 flex flex-col gap-3">
        {/* Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c3c6d7]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar membros por nome ou bio..."
            className="w-full h-12 pl-11 pr-10 bg-[#171f33] text-[#dae2fd] placeholder:text-[#8d90a0] text-sm font-body-sm rounded-full focus:outline-none focus:bg-[#222a3d] transition-all shadow-sm border border-[#434655]/20"
          />
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            <span className="material-symbols-outlined text-[18px] text-[#8d90a0]">tune</span>
          </div>
        </div>

        {/* Level Filter Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'iniciante', label: '🇬🇧 Iniciante' },
            { id: 'basico', label: '🇬🇧 Básico' },
            { id: 'intermedio', label: '🇬🇧 Intermédio' },
            { id: 'avancado', label: '🇬🇧 Avançado' },
          ].map((lvl) => {
            const isActive = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id as any)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-label-sm font-semibold transition-all border ${
                  isActive
                    ? 'bg-[#2563eb] text-[#eeefff] border-[#2563eb] shadow-sm'
                    : 'bg-[#171f33] text-[#c3c6d7] hover:text-[#dae2fd] border-[#434655]/20'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>

        {/* Counter and Status */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label-sm active:scale-95 transition-all shadow-sm border ${
                showOnlineOnly
                  ? 'bg-[#007d55]/30 text-[#4edea3] border-[#4edea3]/40'
                  : 'bg-[#222a3d] text-[#4edea3] border-[#434655]/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span>Online (24)</span>
            </button>
            <span className="text-xs font-caption text-[#c3c6d7]">148 membros ativos</span>
          </div>

          <div className="flex items-center gap-1 text-[#c3c6d7]">
            <span className="material-symbols-outlined text-[18px]">sort</span>
            <span className="text-xs font-caption">Mais ativos</span>
          </div>
        </div>
      </div>

      {/* Main Content List */}
      <div className="flex flex-col gap-4">
        {/* Mentor Spotlight Card */}
        <div className="relative w-full p-5 rounded-2xl bg-[#222a3d] text-[#dae2fd] overflow-hidden shadow-md border border-[#ffb95f]/30">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#ee9800]/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ee9800]/15 text-[#ffb95f] text-xs font-label-sm font-semibold border border-[#ee9800]/30">
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  workspace_premium
                </span>
                <span>Mentor Oficial & Criador</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-caption text-[#ffb95f] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#ffb95f]"></span>
                Host da Sala
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <img
                  alt="Teacher Éric"
                  className="w-16 h-16 rounded-full object-cover shadow-md ring-2 ring-[#ffb95f]/30"
                  src={TEACHER_ERIC_AVATAR}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#4edea3] ring-2 ring-[#222a3d]"></span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-base sm:text-lg font-headline-sm font-bold text-[#dae2fd] leading-snug">
                    Teacher Éric
                  </h2>
                  <span
                    className="material-symbols-outlined text-[#2563eb] text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <span className="text-xs font-caption text-[#b4c5ff]">
                  @teachereric • Lead English Coach
                </span>
                <p className="text-xs sm:text-sm font-body-sm text-[#c3c6d7] line-clamp-2 mt-1 leading-relaxed">
                  "Destravando sua confiança no inglês real com método conversacional e imersão ativa diária."
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setPreviewMember(mentor);
                }}
                className="flex-1 h-10 px-3 rounded-full bg-[#2563eb] hover:bg-[#2563eb]/90 text-[#eeefff] font-label-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                <span>Mensagem</span>
              </button>
              <button
                onClick={() => {
                  setPreviewMember(mentor);
                }}
                className="h-10 px-4 rounded-full bg-[#171f33] hover:bg-[#2d3449] text-[#dae2fd] font-label-md text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all border border-[#434655]/20"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span>Ver Perfil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Members Header */}
        <div className="flex items-center justify-between pt-1 pb-0.5">
          <span className="text-sm font-label-md font-bold text-[#dae2fd]">Membros da Turma</span>
          <span className="text-xs font-caption text-[#c3c6d7]">Conecte-se para praticar</span>
        </div>

        {/* Member Cards List */}
        <div className="flex flex-col gap-3" id="membersList">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="relative w-full p-4 rounded-2xl bg-[#171f33] text-[#dae2fd] shadow-sm border border-[#434655]/20 hover:border-[#2563eb]/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    className="w-12 h-12 rounded-full object-cover shadow-sm ring-1 ring-[#434655]"
                    src={member.avatar}
                    alt={member.name}
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#171f33] ${
                      member.online ? 'bg-[#4edea3]' : 'bg-[#434655]'
                    }`}
                  ></span>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm font-label-md font-semibold text-[#dae2fd] truncate">
                        {member.name}
                      </span>
                      <span className="text-xs font-caption text-[#ffb95f] shrink-0 font-medium">
                        🔥 {member.streakDays}d
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-label-sm bg-[#4edea3]/15 text-[#4edea3] shrink-0 font-semibold border border-[#4edea3]/20">
                      {member.level}
                    </span>
                  </div>

                  <span className="text-xs font-caption text-[#8d90a0]">{member.handle}</span>

                  <p className="text-xs sm:text-sm font-body-sm text-[#c3c6d7] line-clamp-2 mt-1 leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => setPreviewMember(member)}
                      className="flex-1 h-9 px-2 rounded-full bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] font-label-sm text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all border border-[#434655]/30"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Ver Perfil</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenDirectChat) {
                          onOpenDirectChat(member);
                        } else {
                          setPreviewMember(member);
                        }
                      }}
                      className="flex-1 h-9 px-2 rounded-full bg-[#2563eb] text-[#eeefff] hover:bg-[#2563eb]/90 font-label-sm text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>Mensagem</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-xs text-[#8d90a0] bg-[#171f33] rounded-2xl border border-[#434655]/20">
              Nenhum membro encontrado para o filtro selecionado.
            </div>
          )}
        </div>
      </div>

      {/* Member Profile Modal Preview (Image 10 / HTML) */}
      {previewMember && (
        <div
          className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewMember(null);
          }}
        >
          <div className="relative w-full max-w-md bg-[#222a3d] text-[#dae2fd] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#434655]/40 animate-in slide-in-from-bottom duration-200">
            {/* Top Banner with Close */}
            <div className="h-24 w-full bg-gradient-to-r from-[#2563eb]/40 via-[#2d3449] to-[#ee9800]/30 relative">
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#131b2e]/70 text-[#dae2fd] flex items-center justify-center active:scale-90 transition-all hover:bg-[#131b2e]"
                onClick={() => setPreviewMember(null)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="px-5 pb-6 pt-0 relative flex flex-col gap-3.5">
              <div className="flex items-end justify-between -mt-10">
                <div className="relative">
                  <img
                    className="w-20 h-20 rounded-full object-cover shadow-lg ring-2 ring-[#222a3d]"
                    src={previewMember.avatar}
                    alt={previewMember.name}
                  />
                  <span
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ring-[#222a3d] ${
                      previewMember.online ? 'bg-[#4edea3]' : 'bg-[#434655]'
                    }`}
                  ></span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-label-sm bg-[#4edea3]/20 text-[#4edea3] font-semibold border border-[#4edea3]/30">
                  {previewMember.level}
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-headline-sm font-bold text-[#dae2fd]">
                    {previewMember.name}
                  </h3>
                  {previewMember.verified && (
                    <span
                      className="material-symbols-outlined text-[#4edea3] text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  )}
                </div>
                <span className="text-xs font-caption text-[#b4c5ff]">
                  {previewMember.handle} • Membro ativo
                </span>
              </div>

              <p className="text-xs sm:text-sm font-body-sm text-[#dae2fd] leading-relaxed">
                {previewMember.fullBio || previewMember.bio}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#171f33] text-center border border-[#434655]/20">
                  <span className="text-base sm:text-lg font-headline-sm font-bold text-[#ffb95f]">
                    {previewMember.streakDays}
                  </span>
                  <span className="text-[11px] font-caption text-[#8d90a0]">Dias Streak</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#171f33] text-center border border-[#434655]/20">
                  <span className="text-base sm:text-lg font-headline-sm font-bold text-[#4edea3]">
                    {previewMember.practiceCount || 42}
                  </span>
                  <span className="text-[11px] font-caption text-[#8d90a0]">Práticas</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#171f33] text-center border border-[#434655]/20">
                  <span className="text-base sm:text-lg font-headline-sm font-bold text-[#b4c5ff]">
                    {previewMember.topPercent || 'Top 10%'}
                  </span>
                  <span className="text-[11px] font-caption text-[#8d90a0]">Engajamento</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const name = previewMember.name;
                      setPreviewMember(null);
                      alert(`Iniciando chat com ${name}. Você pode praticar speaking agora!`);
                    }}
                    className="flex-1 h-11 rounded-full bg-[#2563eb] hover:bg-[#2563eb]/90 text-[#eeefff] font-label-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Enviar Mensagem</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(`Convite de Speaking Pair enviado para ${previewMember.name}!`);
                    }}
                    className="w-11 h-11 rounded-full bg-[#171f33] hover:bg-[#2d3449] text-[#dae2fd] flex items-center justify-center active:scale-95 transition-all border border-[#434655]/30"
                    title="Convidar para Speaking Pair de 15min"
                  >
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                  </button>
                </div>

                <button
                  className="w-full h-9 rounded-full text-[#8d90a0] font-label-sm text-xs hover:text-[#dae2fd] transition-all"
                  onClick={() => setPreviewMember(null)}
                >
                  Fechar visualização
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
