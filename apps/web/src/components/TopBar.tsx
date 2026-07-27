import { Bell, Search } from 'lucide-react';

interface TopBarProps {
  teacherName: string;
}

export default function TopBar({ teacherName }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b-2 border-canopy-700 bg-canopy-950/60 px-8 py-5">
      <div>
        <h1 className="font-pixel text-sm text-parchment-100">
          Welcome back, {teacherName}
        </h1>
        <p className="mt-1 text-sm text-parchment-400">
          Here's how your jungle classrooms are doing today.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden items-center sm:flex">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-parchment-500" />
          <input
            type="text"
            placeholder="Search students, classes..."
            className="w-64 border-2 border-canopy-700 bg-canopy-900 py-2 pl-9 pr-3 text-sm text-parchment-100 placeholder:text-parchment-500 focus:border-leaf-400 focus:outline-none"
          />
        </div>

        <button className="relative border-2 border-canopy-700 bg-canopy-900 p-2 hover:border-leaf-400">
          <Bell className="h-4 w-4 text-parchment-300" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 border border-canopy-950 bg-mango-400" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center border-2 border-leaf-400 bg-canopy-800 font-pixel text-[10px] text-leaf-200">
          {teacherName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
      </div>
    </header>
  );
}