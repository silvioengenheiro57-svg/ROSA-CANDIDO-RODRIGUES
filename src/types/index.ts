export type TabType = 'channels-chat' | 'ai-tutor' | 'course-content' | 'community-members' | 'student-profile' | 'landing-page';

export type EnglishLevel = 'Iniciante' | 'Básico' | 'Intermédio' | 'Avançado' | 'A1-A2' | 'B1-B2' | 'C1-C2' | 'Todos';

export interface Reaction {
  emoji: string;
  count: number;
  userReacted?: boolean;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderHandle: string;
  senderAvatar: string;
  senderLevel?: string;
  senderBadge?: string;
  isMentor?: boolean;
  isAiBot?: boolean;
  isOutgoing?: boolean;
  time: string;
  content: string;
  aiBreakdown?: AiCorrectionCard;
  reactions?: Reaction[];
  audioUrl?: string;
  audioDuration?: string;
}

export interface AiCorrectionCard {
  title?: string;
  originalText: string;
  highlightedOriginal: string;
  suggestedCorrection: string;
  ruleExplanation: string;
  reasons?: Array<{ title: string; explanation: string }>;
  nativeAlternative: string;
  nativeNote?: string;
  practiceChallenge?: string;
  audioPronunciationText?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  category: 'Prática Ativa' | 'Exclusivo Teacher Éric' | 'Salas de Voz';
  unreadCount?: number;
  isNew?: boolean;
  activeNow?: number;
}

export interface Member {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  level: string;
  levelCategory: 'iniciante' | 'basico' | 'intermedio' | 'avancado';
  streakDays: number;
  xp?: number;
  online: boolean;
  lastActive: string;
  bio: string;
  fullBio?: string;
  role?: string;
  isMentor?: boolean;
  verified?: boolean;
  practiceCount?: number;
  topPercent?: string;
  openToSpeakingPairs?: boolean;
}

export interface ContentResource {
  id: string;
  title: string;
  hook: string;
  type: 'article' | 'audio' | 'video' | 'pdf' | 'challenge';
  category: 'Grammar' | 'Vocabulary' | 'Speaking & Accent' | 'Business English';
  level: 'A1-A2' | 'B1-B2' | 'C1-C2' | 'Todos';
  author: string;
  readTime: string;
  coverImage: string;
  audioFile?: {
    name: string;
    duration: string;
    size: string;
  };
  ericTip?: string;
  bodyText: string;
  hasAiQuiz: boolean;
  linkedChannel: string;
  publishedAt: string;
}
