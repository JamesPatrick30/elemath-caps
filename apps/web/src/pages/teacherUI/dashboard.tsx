import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import StatsOverview from '../../components/StatsOverview';
import ClassOverview from '../../components/ClassOverview';
import StudentLeaderboard from '../../components/StudentLeaderboard';
import QuizGeneratorPanel from '../../components/QuizGeneratorPanel';
import RecentActivity from '../../components/RecentActivity';
import ClassDetailModal from '../../components/ClassDetailModal';
import type {
  ClassRoom,
  LeaderboardEntry,
  ActivityEvent,
  StatSummary,
} from '../../types/dashboard.types';

const stats: StatSummary[] = [
  { id: 's1', label: 'Total Students', value: '128', delta: '+6', deltaDirection: 'up', icon: 'students' },
  { id: 's2', label: 'Quizzes Completed', value: '842', delta: '+54', deltaDirection: 'up', icon: 'quizzes' },
  { id: 's3', label: 'Avg. Accuracy', value: '76%', delta: '-2%', deltaDirection: 'down', icon: 'accuracy' },
  { id: 's4', label: 'Active Streaks', value: '39', delta: '+11', deltaDirection: 'up', icon: 'streak' },
];

const initialClasses: ClassRoom[] = [
  {
    id: 'c1',
    name: 'Mahogany Section',
    gradeLevel: 'Grade 4',
    studentCount: 32,
    avgScore: 84,
    topicFocus: 'Fractions',
    habitat: 'canopy',
    files: [
      { id: 'f1', name: 'Fractions_Worksheet_Wk3.pdf', type: 'pdf', uploadedAt: '2 days ago', sizeKb: 842 },
      { id: 'f2', name: 'Class_Seating_Chart.sheet', type: 'sheet', uploadedAt: '1 week ago', sizeKb: 64 },
    ],
  },
  {
    id: 'c2',
    name: 'Bakawan Bunch',
    gradeLevel: 'Grade 5',
    studentCount: 29,
    avgScore: 71,
    topicFocus: 'Long Division',
    habitat: 'river',
    files: [
      { id: 'f3', name: 'LongDivision_Notes.doc', type: 'doc', uploadedAt: '3 days ago', sizeKb: 210 },
    ],
  },
  {
    id: 'c3',
    name: 'Kalabaw Crew',
    gradeLevel: 'Grade 3',
    studentCount: 34,
    avgScore: 58,
    topicFocus: 'Place Value',
    habitat: 'savanna',
    files: [],
  },
  {
    id: 'c4',
    name: 'Coral Kids',
    gradeLevel: 'Grade 6',
    studentCount: 33,
    avgScore: 90,
    topicFocus: 'Ratios',
    habitat: 'reef',
    files: [
      { id: 'f4', name: 'Ratios_Diagram.png', type: 'image', uploadedAt: '5 hrs ago', sizeKb: 1320 },
      { id: 'f5', name: 'Ratios_Quiz_Bank.pdf', type: 'pdf', uploadedAt: '1 day ago', sizeKb: 980 },
      { id: 'f6', name: 'Progress_Tracker.sheet', type: 'sheet', uploadedAt: '2 weeks ago', sizeKb: 128 },
    ],
  },
];

const leaderboard: LeaderboardEntry[] = [
  { id: 'l1', rank: 1, studentName: 'Maria Reyes', className: 'Coral Kids', xp: 2340, streak: 14, avatarEmoji: '🦋' },
  { id: 'l2', rank: 2, studentName: 'Jomar Cruz', className: 'Mahogany Section', xp: 2115, streak: 9, avatarEmoji: '🐒' },
  { id: 'l3', rank: 3, studentName: 'Angel Santos', className: 'Bakawan Bunch', xp: 1980, streak: 11, avatarEmoji: '🦎' },
  { id: 'l4', rank: 4, studentName: 'Kyle Bautista', className: 'Kalabaw Crew', xp: 1820, streak: 5, avatarEmoji: '🐢' },
  { id: 'l5', rank: 5, studentName: 'Nica Ramos', className: 'Coral Kids', xp: 1795, streak: 7, avatarEmoji: '🦜' },
];

const activity: ActivityEvent[] = [
  { id: 'a1', type: 'quiz_completed', message: 'Maria Reyes finished "Fractions Sprint" — 95%', timestamp: '4 min ago' },
  { id: 'a2', type: 'quiz_generated', message: 'You generated a new quiz on Long Division', timestamp: '22 min ago' },
  { id: 'a3', type: 'streak', message: 'Jomar Cruz reached a 9-day streak', timestamp: '1 hr ago' },
  { id: 'a4', type: 'joined', message: 'Kyle Bautista joined Kalabaw Crew', timestamp: '3 hrs ago' },
  { id: 'a5', type: 'quiz_completed', message: 'Bakawan Bunch class average rose to 71%', timestamp: 'Yesterday' },
];

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<ClassRoom[]>(initialClasses);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const selectedClass = classes.find((c) => c.id === selectedClassId) ?? null;

  const handleUpdateClass = (updated: ClassRoom) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteFile = (classId: string, fileId: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId ? { ...c, files: c.files.filter((f) => f.id !== fileId) } : c,
      ),
    );
  };

  const handleBuildQuizRoom = (classroom: ClassRoom) => {
    // Wire this up to your quiz-room creation flow / route.
    console.log('Building quiz room for', classroom.name);
  };

  return (
    <div className="flex h-screen bg-canopy-950 font-sans text-parchment-100">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar teacherName="Teacher Sanchez" />

        <main className="flex-1 px-8 py-6">
          <StatsOverview stats={stats} />

          <div className="mt-2 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="flex flex-col gap-6 xl:col-span-2">
              <ClassOverview classes={classes} onSelectClass={(c) => setSelectedClassId(c.id)} />
              <QuizGeneratorPanel />
            </div>

            <div className="flex flex-col gap-6">
              <StudentLeaderboard entries={leaderboard} />
              <RecentActivity events={activity} />
            </div>
          </div>
        </main>
      </div>

      {selectedClass && (
        <ClassDetailModal
          classroom={selectedClass}
          onClose={() => setSelectedClassId(null)}
          onSave={handleUpdateClass}
          onBuildQuizRoom={handleBuildQuizRoom}
          onDeleteFile={handleDeleteFile}
        />
      )}
    </div>
  );
}