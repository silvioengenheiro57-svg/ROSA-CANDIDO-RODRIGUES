import React, { useState } from 'react';
import { CHANNELS, MEMBERS, INITIAL_RESOURCES } from '../data/mockData';
import { TabType } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedChannels = CHANNELS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  const matchedMembers = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.handle.toLowerCase().includes(query.toLowerCase()) ||
      m.bio.toLowerCase().includes(query.toLowerCase())
  );

  const matchedResources = INITIAL_RESOURCES.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.hook.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-[#060e20]/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-[#171f33] p-4 shadow-2xl border border-[#434655]/40 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 pb-3 border-b border-[#434655]/30">
          <span className="material-symbols-outlined text-[#b4c5ff] text-[22px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar canais, membros, lições e tópicos..."
            className="flex-1 bg-transparent text-[#dae2fd] text-sm focus:outline-none placeholder:text-[#8d90a0]"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#222a3d] flex items-center justify-center text-[#c3c6d7] hover:text-[#dae2fd]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 py-3 space-y-4 no-scrollbar">
          {/* Channels */}
          <div>
            <span className="text-[11px] font-label-sm text-[#ffb95f] uppercase tracking-wider font-bold block mb-1.5">
              Canais
            </span>
            <div className="space-y-1">
              {matchedChannels.slice(0, 3).map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    onNavigate('channels-chat');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#222a3d] text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">tag</span>
                    <span className="text-sm font-semibold text-[#dae2fd]">#{ch.name}</span>
                  </div>
                  <span className="text-xs text-[#8d90a0] font-caption truncate max-w-[200px]">
                    {ch.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            <span className="text-[11px] font-label-sm text-[#4edea3] uppercase tracking-wider font-bold block mb-1.5">
              Membros
            </span>
            <div className="space-y-1">
              {matchedMembers.slice(0, 3).map((mem) => (
                <button
                  key={mem.id}
                  onClick={() => {
                    onNavigate('community-members');
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#222a3d] text-left transition-colors"
                >
                  <img src={mem.avatar} alt={mem.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#dae2fd] truncate">{mem.name}</p>
                    <p className="text-xs text-[#8d90a0] font-caption truncate">{mem.handle}</p>
                  </div>
                  <span className="text-xs text-[#b4c5ff] font-semibold">{mem.level}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Educational Resources */}
          <div>
            <span className="text-[11px] font-label-sm text-[#b4c5ff] uppercase tracking-wider font-bold block mb-1.5">
              Conteúdos & Lições
            </span>
            <div className="space-y-1">
              {matchedResources.slice(0, 3).map((res) => (
                <button
                  key={res.id}
                  onClick={() => {
                    onNavigate('course-content');
                    onClose();
                  }}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#222a3d] text-left transition-colors"
                >
                  <span className="material-symbols-outlined text-[#b4c5ff] text-[20px] mt-0.5">
                    article
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-[#dae2fd] line-clamp-1">
                      {res.title}
                    </p>
                    <p className="text-[11px] text-[#8d90a0] line-clamp-1">{res.hook}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
