import { NavLink } from 'react-router-dom';

const items = [
  { path: '/', icon: '⚡', label: 'Log' },
  { path: '/history', icon: '📋', label: 'History' },
  { path: '/analytics', icon: '📊', label: 'Analytics' },
  { path: '/skills', icon: '🧠', label: 'Skills' },
  { path: '/projects', icon: '🚀', label: 'Projects' },
  { path: '/jobs', icon: '💼', label: 'Jobs' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-2 border-t border-white/5 z-50 flex justify-around items-center px-1 py-1.5 safe-area-bottom">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg text-[10px] transition-colors ${
              isActive ? 'text-accent-2' : 'text-text-3 hover:text-text-2'
            }`
          }
        >
          <span className="text-base">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
