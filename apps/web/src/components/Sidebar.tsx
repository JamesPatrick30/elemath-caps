import {
  LayoutDashboard,
  Users,
  Trophy,
  Sparkles,
  BarChart3,
  Settings,
  TreePine,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Classes', icon: Users, active: false },
  { label: 'Quiz Generator', icon: Sparkles, active: false },
  { label: 'Leaderboard', icon: Trophy, active: false },
  { label: 'Reports', icon: BarChart3, active: false },
  { label: 'Settings', icon: Settings, active: false },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-60 flex-col justify-between border-r-2 border-canopy-700 bg-canopy-950 px-4 py-6">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <TreePine className="h-6 w-6 text-leaf-400" strokeWidth={2.2} />
          <span className="font-pixel text-xs text-leaf-300">ELEMATH</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`group flex items-center gap-3 border-2 px-3 py-2 text-left text-sm transition-colors ${
                active
                  ? 'border-leaf-400 bg-canopy-800 text-leaf-200'
                  : 'border-transparent text-parchment-300 hover:border-canopy-700 hover:bg-canopy-900'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${active ? 'text-leaf-400' : 'text-parchment-400 group-hover:text-leaf-400'}`}
              />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <button className="flex items-center gap-3 border-2 border-transparent px-3 py-2 text-sm text-parchment-400 hover:border-canopy-700 hover:bg-canopy-900 hover:text-mango-300">
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </aside>
  );
}