const Icon = ({ children, size = 18, className = '', strokeWidth = 1.5, ...rest }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

export const Icons = {
  Logo: ({ size = 22, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M19 6.5a7 7 0 0 0-12 4.6c0 3.2 2.4 4.6 6 5.4 3.2.7 5 1.5 5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="6.2" cy="18.4" r="1.6" fill="currentColor"/>
    </svg>
  ),
  ArrowRight:   () => <Icon><path d="M5 12h14M13 6l6 6-6 6"/></Icon>,
  ArrowUpRight: () => <Icon><path d="M7 17 17 7M9 7h8v8"/></Icon>,
  Search:   ({ size }) => <Icon size={size}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>,
  MapPin:   ({ size }) => <Icon size={size}><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></Icon>,
  Flag:     ({ size }) => <Icon size={size}><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></Icon>,
  Clock:    ({ size }) => <Icon size={size}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  Calendar: ({ size }) => <Icon size={size}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></Icon>,
  User:     ({ size }) => <Icon size={size}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Icon>,
  Users:    ({ size }) => <Icon size={size}><circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20a6 6 0 0 0-5-5.9"/></Icon>,
  Home:     ({ size }) => <Icon size={size}><path d="M3 11 12 4l9 7M5 10v10h14V10"/></Icon>,
  Car:      ({ size }) => <Icon size={size}><path d="M4 14h16l-1.6-5a2 2 0 0 0-1.9-1.4H7.5A2 2 0 0 0 5.6 9L4 14Z"/><path d="M4 14v4h2v-2M20 14v4h-2v-2"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></Icon>,
  Wallet:   ({ size }) => <Icon size={size}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M17 14h2"/></Icon>,
  Settings: ({ size }) => <Icon size={size}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.1.6.5 1 1 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></Icon>,
  Route:    ({ size }) => <Icon size={size}><circle cx="6" cy="5" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M6 7.5V12a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v-3.5"/></Icon>,
  Shield:   ({ size }) => <Icon size={size}><path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></Icon>,
  Zap:      ({ size }) => <Icon size={size}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></Icon>,
  Tag:      ({ size }) => <Icon size={size}><path d="M20 13.5 13.5 20a2 2 0 0 1-2.8 0L3 12.3V3h9.3L20 10.7a2 2 0 0 1 0 2.8Z"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/></Icon>,
  Plus:     ({ size }) => <Icon size={size}><path d="M12 5v14M5 12h14"/></Icon>,
  Filter:   ({ size }) => <Icon size={size}><path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z"/></Icon>,
  Bell:     ({ size }) => <Icon size={size}><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></Icon>,
  Menu:     ({ size }) => <Icon size={size}><path d="M4 7h16M4 12h16M4 17h16"/></Icon>,
  Close:    ({ size }) => <Icon size={size}><path d="M6 6l12 12M18 6 6 18"/></Icon>,
  ChevronDown:  ({ size }) => <Icon size={size}><path d="m6 9 6 6 6-6"/></Icon>,
  ChevronRight: ({ size }) => <Icon size={size}><path d="m9 6 6 6-6 6"/></Icon>,
  Check:    ({ size }) => <Icon size={size}><path d="m5 12 5 5 9-12"/></Icon>,
  Star:     ({ size }) => <Icon size={size}><path d="m12 3 2.7 5.7 6.3.8-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.8L12 3Z"/></Icon>,
  Receipt:  ({ size }) => <Icon size={size}><path d="M5 3v18l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5 2-1.5V3"/><path d="M8 8h8M8 12h8M8 16h5"/></Icon>,
  TrendUp:  ({ size }) => <Icon size={size}><path d="M3 17 9 11l4 4 8-9"/><path d="M14 6h7v7"/></Icon>,
  Eye:      ({ size }) => <Icon size={size}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></Icon>,
  DotsH:    ({ size }) => <Icon size={size}><circle cx="6" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18" cy="12" r="1.2" fill="currentColor"/></Icon>,
  Sparkle:  ({ size }) => <Icon size={size}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><path d="m6 6 3 3M15 15l3 3M6 18l3-3M15 9l3-3"/></Icon>,
  Headset:  ({ size }) => <Icon size={size}><path d="M4 14v-2a8 8 0 1 1 16 0v2"/><rect x="3" y="14" width="5" height="6" rx="1.5"/><rect x="16" y="14" width="5" height="6" rx="1.5"/></Icon>,
  Globe:    ({ size }) => <Icon size={size}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></Icon>,
  ListChecks:({ size }) => <Icon size={size}><path d="M10 6h11M10 12h11M10 18h11M4 6l1 1 2-3M4 12l1 1 2-3M4 18l1 1 2-3"/></Icon>,
  Navigation:({ size }) => <Icon size={size}><path d="m3 11 19-9-9 19-2-8-8-2Z"/></Icon>,
  Banknote: ({ size }) => <Icon size={size}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0"/><path d="M6 12h.01M18 12h.01"/></Icon>,
  DollarSign:({ size }) => <Icon size={size}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Icon>,
  BarChart: ({ size }) => <Icon size={size}><path d="M12 20V10M18 20V4M6 20v-4"/></Icon>,
  RefreshCcw:({ size }) => <Icon size={size}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></Icon>,
  MapPinned:({ size }) => <Icon size={size}><path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/><path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712"/></Icon>,
  Gauge:    ({ size }) => <Icon size={size}><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></Icon>,
  SlidersH: ({ size }) => <Icon size={size}><path d="M21 4H8M16 9H3M21 14H8M16 19H3"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="7" x2="3" y2="11"/><line x1="8" y1="12" x2="8" y2="16"/><line x1="3" y1="17" x2="3" y2="21"/></Icon>,
  LogOut:   ({ size }) => <Icon size={size}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>,
  KeyRound: ({ size }) => <Icon size={size}><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4L2 18Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></Icon>,
  Mail:     ({ size }) => <Icon size={size}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></Icon>,
  Phone:    ({ size }) => <Icon size={size}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.91 6.91l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 16.92z"/></Icon>,
};

export function Avatar({ name = '', size = 32, tone = 'light' }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '·';
  const base = 'inline-flex items-center justify-center rounded-full border font-semibold tabular shrink-0';
  const styles = tone === 'dark'
    ? 'bg-ink-900 text-white border-ink-800'
    : 'bg-ink-100 text-ink-900 border-ink-200';
  return (
    <div
      className={`${base} ${styles}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

export function Pill({ children, className = '', dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[12px] font-medium bg-ink-100 text-ink-800 border border-black/[0.08] ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-ink-950"/>}
      {children}
    </span>
  );
}
