import { cn } from './UI.jsx';

function Icon({ children, className, viewBox = '0 0 24 24' }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('h-4 w-4 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox={viewBox}
    >
      {children}
    </svg>
  );
}

export function LogoIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 5h10v10" />
      <path d="M14 10 5 19" />
      <path d="M5 10V5h5" />
    </Icon>
  );
}

export function BoltIcon(props) {
  return (
    <Icon {...props}>
      <path d="m13 2-8 11h6l-1 9 8-11h-6z" />
    </Icon>
  );
}

export function SearchIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Icon>
  );
}

export function BookmarkIcon({ filled = false, ...props }) {
  return (
    <Icon {...props}>
      <path
        fill={filled ? 'currentColor' : 'none'}
        d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1Z"
      />
    </Icon>
  );
}

export function SettingsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function RefreshIcon(props) {
  return (
    <Icon {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </Icon>
  );
}

export function FilterIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </Icon>
  );
}

export function SparklesIcon(props) {
  return (
    <Icon {...props}>
      <path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z" />
      <path d="M5 3v2" />
      <path d="M19 17v2" />
      <path d="M3 5h2" />
      <path d="M17 19h2" />
    </Icon>
  );
}

export function MergeIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8.2 7.4 11 15.5" />
      <path d="M15.8 7.4 13 15.5" />
    </Icon>
  );
}

export function UsersIcon(props) {
  return (
    <Icon {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M15 4.13a3.5 3.5 0 0 1 0 7" />
    </Icon>
  );
}

export function DatabaseIcon(props) {
  return (
    <Icon {...props}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.66 3.13 3 7 3s7-1.34 7-3V5" />
      <path d="M5 11v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
    </Icon>
  );
}

export function FileDiffIcon(props) {
  return (
    <Icon {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14" />
      <path d="M14 3v5h5" />
      <path d="M19 8v11a2 2 0 0 1-2 2H7" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </Icon>
  );
}

export function ArrowRightIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </Icon>
  );
}

export function ArrowDownUpIcon(props) {
  return (
    <Icon {...props}>
      <path d="m8 3-4 4 4 4" />
      <path d="M4 7h12" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H8" />
    </Icon>
  );
}

export function PlusIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  );
}

export function MinusIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
    </Icon>
  );
}

export function BookIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </Icon>
  );
}

export function ExternalLinkIcon(props) {
  return (
    <Icon {...props}>
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 14v5H5V5h5" />
    </Icon>
  );
}

export function XIcon(props) {
  return (
    <Icon {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </Icon>
  );
}

export function CpuIcon(props) {
  return (
    <Icon {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M12 1v3" />
      <path d="M12 20v3" />
      <path d="M4.93 4.93 7.05 7.05" />
      <path d="m16.95 16.95 2.12 2.12" />
      <path d="M1 12h3" />
      <path d="M20 12h3" />
      <path d="m4.93 19.07 2.12-2.12" />
      <path d="m16.95 7.05 2.12-2.12" />
    </Icon>
  );
}

export function BranchIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 3v12" />
      <path d="M18 9v12" />
      <path d="M6 9h12" />
      <circle cx="6" cy="3" r="2.5" />
      <circle cx="6" cy="15" r="2.5" />
      <circle cx="18" cy="9" r="2.5" />
      <circle cx="18" cy="21" r="2.5" />
    </Icon>
  );
}

export function PaletteIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2a5 5 0 0 0 0-10Z" />
      <circle cx="7.5" cy="10" r="1" />
      <circle cx="9.5" cy="6.5" r="1" />
      <circle cx="14.5" cy="6.5" r="1" />
      <circle cx="16.5" cy="10" r="1" />
    </Icon>
  );
}

export function BellIcon(props) {
  return (
    <Icon {...props}>
      <path d="M15 17H5.5a1.5 1.5 0 0 1-1.3-2.25L6 11V9a6 6 0 0 1 12 0v2l1.8 3.75A1.5 1.5 0 0 1 18.5 17H15" />
      <path d="M9 21a3 3 0 0 0 6 0" />
    </Icon>
  );
}

export function HelpIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.1 9a3 3 0 1 1 5.2 2c-.6.6-1.3 1-1.8 1.6-.37.41-.5.73-.5 1.4" />
      <path d="M12 17h.01" />
    </Icon>
  );
}

export function UserIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icon>
  );
}

export function WarningIcon(props) {
  return (
    <Icon {...props}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Icon>
  );
}

export function PlugIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 22v-5" />
      <path d="M9 7V2" />
      <path d="M15 7V2" />
      <path d="M5 9h14v2a7 7 0 0 1-14 0V9Z" />
    </Icon>
  );
}

export function SaveIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 21h14a1 1 0 0 0 1-1V7.41a1 1 0 0 0-.29-.7l-2.42-2.42A1 1 0 0 0 16.59 4H5a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1Z" />
      <path d="M8 21v-7h8v7" />
      <path d="M8 4v5h6" />
    </Icon>
  );
}

export function ResetIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v6h6" />
    </Icon>
  );
}

export function BotIcon(props) {
  return (
    <Icon {...props}>
      <rect x="5" y="8" width="14" height="10" rx="2" />
      <path d="M12 3v5" />
      <path d="M9 13h.01" />
      <path d="M15 13h.01" />
      <path d="M9 18v2" />
      <path d="M15 18v2" />
    </Icon>
  );
}

export function TrashIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 14h10l1-14" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </Icon>
  );
}

export function ChevronDownIcon(props) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function RocketIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5s3 2.5 3 2.5a24.28 24.28 0 0 0 5-5" />
      <path d="M22 2s-1.5 1.5-4 4" />
      <path d="M12 12c-1.15 1.15-2.3 2.2-3 3.5A3 3 0 0 0 12.5 21c1.3-.7 2.35-1.85 3.5-3" />
      <path d="M12 12c1.15-1.15 2.2-2.3 3.5-3A3 3 0 0 1 21 12.5c-.7 1.3-1.85 2.35-3 3.5" />
      <path d="M20 4a2 2 0 1 0-4 0a2 2 0 1 0 4 0Z" />
    </Icon>
  );
}

export function UserRoundIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </Icon>
  );
}

export function CameraIcon(props) {
  return (
    <Icon {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </Icon>
  );
}

export function KeyIcon(props) {
  return (
    <Icon {...props}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </Icon>
  );
}