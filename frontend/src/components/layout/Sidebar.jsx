import { NavLink } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext.jsx';
import {
  BookmarkIcon,
  BoltIcon,
  SearchIcon,
  SettingsIcon,
} from '../common/Icons.jsx';
import { cn } from '../common/UI.jsx';
import productIcon from '../../assets/product-icon.svg';

const NAV_ITEMS = [
  { to: '/', label: 'Feed', icon: BoltIcon },
  { to: '/search', label: 'Search', icon: SearchIcon },
  { to: '/saved', label: 'Saved', icon: BookmarkIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const { routerStatus, currentUser } = useAppData();
  const providers = routerStatus?.providers || [];

  return (
    <aside className="w-full shrink-0 border-b border-line bg-sidebar lg:sticky lg:top-0 lg:h-screen lg:w-[244px] lg:self-start lg:overflow-hidden lg:border-b-0 lg:border-r xl:w-[252px]">
      <div className="flex h-full flex-col gap-3 p-4 lg:gap-4">
        <div className="space-y-4 overflow-x-hidden">
          <div className="mt-1 flex items-center gap-3">
            <img alt="PR Intel product icon" className="h-9 w-9 shrink-0 rounded-[12px] object-cover shadow-[0_10px_24px_rgba(37,99,235,0.28)]" src={productIcon} />
            <div>
              <div className="text-[14px] font-semibold leading-none text-ink">PR Intel</div>
              <div className="mt-1.5 text-[12px] leading-none text-soft">Rocket.Chat</div>
            </div>
          </div>

          {currentUser && currentUser.username ? (
            <div className="flex items-center gap-3 rounded-[12px] border border-line bg-panel px-3 py-2.5 shadow-sm">
              {currentUser.avatarUrl ? (
                <img
                  alt={currentUser.username}
                  className="h-9 w-9 shrink-0 rounded-full border border-line object-cover"
                  src={currentUser.avatarUrl}
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-active text-sm font-semibold text-accent">
                  {currentUser.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate text-[12px] font-semibold text-ink">@{currentUser.username}</div>
                <div className="truncate text-[12px] text-soft">Signed in with GitHub</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-[12px] border border-line bg-panel px-3 py-2.5 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-active text-sm font-semibold text-accent">
                GH
              </div>
              <div className="min-w-0">
                <a href="/api/auth/github" className="truncate text-[12px] font-semibold text-accent hover:underline">Sign in with GitHub</a>
                <div className="truncate text-[12px] text-soft">Not signed in</div>
              </div>
            </div>
          )}

          <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'relative flex min-w-fit items-center gap-3 py-2 text-[14px] transition-all duration-150',
                    isActive
                      ? '-mx-4 border-l-[4px] border-accent bg-active px-4 font-semibold text-accent'
                      : '-mx-4 px-5 font-medium text-soft hover:bg-active/60 hover:text-accent'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto shrink-0 pt-1">
          <div className="rounded-[12px] border border-line bg-panel px-3 py-3 shadow-sm">
            <div className="mb-2 text-[13px] font-medium tracking-wide text-soft">AI Providers</div>
            <div className="space-y-1.5">
              {providers.length ? (
                providers.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between gap-2 text-[11px] leading-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-success" />
                      <span className="font-medium text-ink">{provider.name}</span>
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold text-success">healthy</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-soft">Checking providers...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
