/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, Member } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ChannelsTab } from './components/ChannelsTab';
import { AiTutorTab } from './components/AiTutorTab';
import { ContentTab } from './components/ContentTab';
import { MembersTab } from './components/MembersTab';
import { ProfileTab } from './components/ProfileTab';
import { LandingPage } from './components/LandingPage';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('channels-chat');
  const [tutorInitialSentence, setTutorInitialSentence] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const handleOpenTutorWithSentence = (sentence: string) => {
    setTutorInitialSentence(sentence);
    setCurrentTab('ai-tutor');
  };

  const handleOpenMemberProfile = (memberId: string) => {
    if (memberId === 'silvio-dombaxe') {
      setCurrentTab('student-profile');
    } else {
      setCurrentTab('community-members');
    }
  };

  const handleOpenDirectChat = (member: Member) => {
    setCurrentTab('channels-chat');
  };

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#2563eb] selection:text-[#eeefff]">
      {/* Header (displayed on application tabs, with landing page toggle) */}
      {currentTab !== 'landing-page' ? (
        <Header
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => {
            setIsNotificationsOpen(true);
            setUnreadNotifications(0);
          }}
          unreadNotificationsCount={unreadNotifications}
        />
      ) : (
        /* Minimal Top Header for Landing Page */
        <header className="fixed top-0 inset-x-0 z-50 bg-[#0b1326]/80 backdrop-blur-xl shadow-md pt-safe border-b border-[#434655]/20">
          <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-5xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#2563eb]/20 flex items-center justify-center text-[#b4c5ff] shrink-0 border border-[#2563eb]/30">
                <span className="material-symbols-outlined text-[22px]">translate</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-sm font-bold text-[#dae2fd] tracking-tight">
                  Teacher Éric
                </span>
                <span className="font-caption text-xs text-[#c3c6d7]">Comunidade</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('channels-chat')}
                className="h-10 px-4 rounded-full bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] font-label-md text-xs sm:text-sm font-semibold inline-flex items-center justify-center transition-colors border border-[#434655]/30"
              >
                Entrar na App
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 flex flex-col relative w-full pt-16 bg-[#0b1326]">
        {currentTab === 'channels-chat' && (
          <ChannelsTab
            onOpenMemberProfile={handleOpenMemberProfile}
            onOpenTutorWithSentence={handleOpenTutorWithSentence}
          />
        )}

        {currentTab === 'ai-tutor' && (
          <AiTutorTab initialSentence={tutorInitialSentence} />
        )}

        {currentTab === 'course-content' && <ContentTab />}

        {currentTab === 'community-members' && (
          <MembersTab
            onOpenDirectChat={handleOpenDirectChat}
            onOpenProfileTab={handleOpenMemberProfile}
          />
        )}

        {currentTab === 'student-profile' && <ProfileTab />}

        {currentTab === 'landing-page' && (
          <LandingPage
            onEnterCommunity={() => setCurrentTab('channels-chat')}
            onOpenAiTutor={() => setCurrentTab('ai-tutor')}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      {currentTab !== 'landing-page' && (
        <Navigation
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aiTutorBadge={unreadNotifications > 0}
        />
      )}

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setIsSearchOpen(false);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectAction={(actionType) => {
          if (actionType === 'Feedback') {
            setCurrentTab('ai-tutor');
          } else if (actionType === 'Live') {
            setCurrentTab('channels-chat');
          } else {
            setCurrentTab('student-profile');
          }
        }}
      />
    </div>
  );
}
