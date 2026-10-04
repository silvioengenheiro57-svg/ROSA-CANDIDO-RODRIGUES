import React from 'react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  aiTutorBadge?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  aiTutorBadge = false,
}) => {
  const navItems: Array<{
    id: TabType;
    label: string;
    icon: string;
  }> = [
    { id: 'channels-chat', label: 'Canais', icon: 'forum' },
    { id: 'ai-tutor', label: 'AI Tutor', icon: 'smart_toy' },
    { id: 'course-content', label: 'Conteúdos', icon: 'menu_book' },
    { id: 'community-members', label: 'Membros', icon: 'groups' },
    { id: 'student-profile', label: 'Perfil', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#131b2e]/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.45)] border-t border-[#434655]/20">
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-2 rounded-xl transition-all active:scale-95 relative ${
                isActive
                  ? 'text-[#b4c5ff] bg-[#2563eb]/15 font-semibold shadow-inner'
                  : 'text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#171f33]/40'
              }`}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
                {item.id === 'ai-tutor' && aiTutorBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#4edea3] animate-ping" />
                )}
              </div>
              <span className="font-label-sm text-[11px] leading-tight mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
