export interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'sheet' | 'image' | 'other';
  uploadedAt: string;
  sizeKb: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  gradeLevel: string;
  studentCount: number;
  avgScore: number; // 0-100
  topicFocus: string;
  habitat: 'canopy' | 'river' | 'savanna' | 'reef';
  files: UploadedFile[];
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  studentName: string;
  className: string;
  xp: number;
  streak: number;
  avatarEmoji: string;
}

export interface ActivityEvent {
  id: string;
  type: 'quiz_completed' | 'quiz_generated' | 'streak' | 'joined';
  message: string;
  timestamp: string;
  studentName?: string;
}

export interface StatSummary {
  id: string;
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'flat';
  icon: 'students' | 'quizzes' | 'accuracy' | 'streak';
}

export interface QuizDraftConfig {
  topic: string;
  gradeLevel: string;
  questionCount: number;
  difficulty: 'sprout' | 'sapling' | 'canopy';
}