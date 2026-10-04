import React from 'react';
import { TEACHER_ERIC_AVATAR } from '../data/mockData';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionType: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Teacher Éric agendou uma Live!',
      time: 'Há 15 min',
      body: 'Tema: "Simulação de Entrevistas em Big Techs ao vivo". Hoje às 19:00.',
      icon: 'campaign',
      badge: 'Live',
      avatar: TEACHER_ERIC_AVATAR,
      isUnread: true,
    },
    {
      id: 'n2',
      title: 'AI English Tutor analisou sua mensagem',
      time: 'Há 1 hora',
      body: 'Seu raio-x da frase condicional está disponível para consulta e treino de pronúncia.',
      icon: 'smart_toy',
      badge: 'Feedback',
      isUnread: true,
    },
    {
      id: 'n3',
      title: 'Camila Santos enviou uma reação',
      time: 'Há 2 horas',
      body: 'Reagiu com 🔥 na sua resposta do desafio diário no #english-only.',
      icon: 'local_fire_department',
      badge: 'Comunidade',
      isUnread: false,
    },
    {
      id: 'n4',
      title: 'Streak de 14 Dias Conquistado!',
      time: 'Ontem',
      body: 'Você manteve o ritmo consistente por 2 semanas seguidas. +50 XP bônus creditados!',
      icon: 'workspace_premium',
      badge: 'Conquista',
      isUnread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-[#060e20]/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-[#171f33] p-4 shadow-2xl border border-[#434655]/40 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#434655]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb95f] text-[22px]">
              notifications
            </span>
            <h3 className="font-headline-sm text-base font-bold text-[#dae2fd]">
              Notificações da Comunidade
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#222a3d] flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-2 space-y-2 max-h-[70vh] overflow-y-auto no-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onSelectAction(n.badge);
                onClose();
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                n.isUnread
                  ? 'bg-[#222a3d] border-[#2563eb]/40 hover:bg-[#2d3449]'
                  : 'bg-[#131b2e] border-[#434655]/20 hover:bg-[#171f33]'
              }`}
            >
              <div className="relative shrink-0 mt-0.5">
                {n.avatar ? (
                  <img src={n.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#2563eb]/20 text-[#b4c5ff] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
                  </div>
                )}
                {n.isUnread && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ffb95f]"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#dae2fd] truncate">
                    {n.title}
                  </h4>
                  <span className="text-[10px] font-caption text-[#8d90a0] shrink-0">
                    {n.time}
                  </span>
                </div>
                <p className="text-xs font-body-sm text-[#c3c6d7] mt-0.5 leading-relaxed">
                  {n.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
