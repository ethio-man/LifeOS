import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function Shell() {
  return (
    <div className="flex h-screen bg-bg text-text font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto flex flex-col pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
