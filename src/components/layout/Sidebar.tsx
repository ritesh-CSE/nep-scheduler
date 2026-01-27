import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Building2, BookOpen, Users, DoorOpen, 
  GraduationCap, Calendar, Settings, ChevronRight 
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/departments', label: 'Departments', icon: Building2 },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/faculty', label: 'Faculty', icon: Users },
  { href: '/rooms', label: 'Rooms', icon: DoorOpen },
  { href: '/students', label: 'Students', icon: GraduationCap },
  { href: '/timetable', label: 'Timetable', icon: Calendar },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
          <Calendar className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-sidebar-foreground">NEP 2020</h1>
          <p className="text-xs text-sidebar-foreground/60">Timetable System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg' 
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* NEP 2020 Badge */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="rounded-lg bg-sidebar-accent p-4">
          <p className="text-xs font-medium text-sidebar-accent-foreground">
            Aligned with
          </p>
          <p className="text-sm font-bold text-sidebar-primary">
            NEP 2020 Guidelines
          </p>
          <p className="mt-1 text-xs text-sidebar-foreground/60">
            Multidisciplinary • Credit-Based
          </p>
        </div>
      </div>
    </aside>
  );
}
