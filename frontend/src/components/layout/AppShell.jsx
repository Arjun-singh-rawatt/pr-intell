import { Outlet } from 'react-router-dom';
import { useDrawerPR } from '../../hooks/useDrawerPR.js';
import PRDetailDrawer from '../pr/PRDetailDrawer.jsx';
import Sidebar from './Sidebar.jsx';

export default function AppShell() {
  const { prNumber, closePR } = useDrawerPR();

  return (
    <div className="app-container min-h-screen lg:h-screen">
      <div className="app-viewport flex min-h-screen w-full overflow-hidden bg-shell text-ink lg:h-screen">
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden lg:h-screen lg:flex-row">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-shell">
            <div className="mx-auto w-full max-w-[1120px] px-4 pb-10 pt-4 lg:px-5 lg:py-5 xl:px-6">
              <Outlet />
            </div>
          </main>
        </div>
        <PRDetailDrawer prNumber={prNumber} onClose={closePR} />
      </div>
    </div>
  );
}
