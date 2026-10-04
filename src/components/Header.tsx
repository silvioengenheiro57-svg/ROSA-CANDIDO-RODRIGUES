import React from 'react';
import { TEACHER_ERIC_AVATAR } from '../data/mockData';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onOpenDrawer?: () => void;
  onNavigate: (tab: TabType) => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenDrawer,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount = 2,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'channels-chat':
        return 'Channels Chat';
      case 'ai-tutor':
        return 'Ai Tutor';
      case 'course-content':
        return 'Conteúdos';
      case 'community-members':
        return 'Community Members';
      case 'student-profile':
        return 'Student Profile';
      case 'landing-page':
        return 'Comunidade Teacher Éric';
      default:
        return 'Comunidade';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#131b2e]/85 backdrop-blur-xl pt-safe shadow-[0_4px_24px_rgba(0,0,0,0.35)] border-b border-[#434655]/30">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Left branding & drawer button */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onOpenDrawer}
            aria-label="Menu de Canais"
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#171f33] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-[11px] text-[#ffb95f] uppercase tracking-wider font-bold">
                Teacher Éric Community
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            </div>
            <h1 className="font-headline-sm text-base text-[#dae2fd] truncate leading-tight font-bold">
              {getTabTitle()}
            </h1>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenSearch}
            aria-label="Buscar"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#171f33] active:scale-95 transition-all"
            title="Pesquisar mensagens e lições"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            onClick={onOpenNotifications}
            aria-label="Notificações"
            className="w-10 h-10 relative rounded-full flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#171f33] active:scale-95 transition-all"
            title="Avisos e notificações"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ffb95f] ring-2 ring-[#131b2e]"></span>
            )}
          </button>

          <button
            onClick={() => onNavigate('landing-page')}
            title="Ver Página de Apresentação"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#222a3d] hover:bg-[#2d3449] text-xs text-[#b4c5ff] font-medium transition-colors ml-1"
          >
            <span className="material-symbols-outlined text-[15px]">public</span>
            <span>Landing Page</span>
          </button>

          {/* Teacher Éric Avatar Indicator */}
          <button
            onClick={() => onNavigate('student-profile')}
            className="relative ml-1 focus:outline-none"
            title="Ver Perfil"
          >
            <img
              alt="Teacher Éric Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#2563eb]/40"
              src={TEACHER_ERIC_AVATAR}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-[#131b2e]"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
