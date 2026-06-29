export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function Panel({ as: Tag = 'section', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-[12px] border border-line bg-panel shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Button({
  as: Tag = 'button',
  className,
  children,
  variant = 'solid',
  size = 'md',
  ...props
}) {
  const variants = {
    solid: 'bg-accent text-white hover:bg-accent2',
    light: 'bg-accent text-white hover:bg-accent2',
    outline: 'border border-line bg-panel text-ink hover:bg-panel2',
    ghost: 'text-soft hover:bg-panel2 hover:text-ink',
    soft: 'border border-line bg-panel2 text-ink hover:bg-active',
    muted: 'bg-panel2 text-soft hover:bg-active hover:text-ink',
  };

  const sizes = {
    sm: 'h-9 px-3 text-xs font-medium rounded-[8px]',
    md: 'h-9 px-3.5 text-[13px] font-medium rounded-[10px]',
    lg: 'h-10 px-4 text-[13px] font-semibold rounded-[10px]',
    icon: 'h-9 w-9 justify-center px-0 rounded-[10px]',
  };

  return (
    <Tag
      className={cn(
        'inline-flex items-center gap-2 font-sans transition-colors disabled:cursor-not-allowed disabled:opacity-50 justify-center shrink-0',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function TextInput({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-[8px] border border-line bg-recessed px-3.5 text-[13px] text-ink outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent',
        className
      )}
      {...props}
    />
  );
}

export function Pill({ className, children, tone = 'neutral' }) {
  const tones = {
    neutral: 'border border-line bg-panel2 text-soft',
    accent: 'border border-accent/30 bg-active text-accent',
    success: 'border border-success/30 bg-success/10 text-success',
    warn: 'border border-warn/30 bg-warn/10 text-warn',
    violet: 'border border-violet/30 bg-violet/10 text-violet',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, description, actions }) {
  return (
    <div className="space-y-1">
      {eyebrow ? (
        <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">{eyebrow}</p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h1 className="shrink-0 text-[24px] font-bold leading-tight tracking-tight text-ink lg:text-[26px]">
          {title}
        </h1>
        {actions ? (
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">{actions}</div>
        ) : null}
      </div>
      {description ? (
        <p className="max-w-3xl text-[13px] leading-5 text-soft lg:text-sm">{description}</p>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <Panel className="flex min-h-[220px] flex-col items-center justify-center gap-4 border-dashed border-line bg-panel p-8 text-center">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <p className="max-w-md text-sm leading-6 text-soft">{description}</p>
      </div>
      {action}
    </Panel>
  );
}

const METRIC_ACCENT_GLOW = {
  'text-success': '',
  'text-blue': '',
  'text-violet': '',
  'text-warn': '',
};

export function MetricCard({ icon, label, value, meta, metaClass, accent = 'text-accent' }) {
  return (
    <Panel className="rounded-[8px] border border-line bg-panel p-3.5 shadow-sm">
      <div className="flex items-center gap-2 text-soft">
        <span className={cn('shrink-0', accent)}>{icon}</span>
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      <div className="mt-2 text-[24px] font-bold leading-none tracking-tight text-ink lg:text-[26px]">{value}</div>
      {meta ? (
        <p className={cn('mt-2 text-xs leading-5 font-semibold', metaClass || 'text-soft')}>
          {meta}
        </p>
      ) : null}
    </Panel>
  );
}

export function Toggle({ checked, disabled = false }) {
  return (
    <span
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer',
        checked ? 'bg-accent' : 'bg-line',
        disabled && 'opacity-60 pointer-events-none'
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-panel transition-transform shadow-sm',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </span>
  );
}
