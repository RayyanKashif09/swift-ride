import { Icons, Avatar, Pill } from './Icons.jsx';

function cn(...c) { return c.filter(Boolean).join(' '); }

export function Button({ variant = 'primary', size = 'md', children, className = '', icon, iconRight, ...rest }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium btn-press select-none';
  const sizes = {
    sm: 'h-9 px-4 text-[13px] rounded-xl',
    md: 'h-11 px-5 text-[14px] rounded-xl',
    lg: 'h-14 px-7 text-[15px] rounded-2xl',
    xl: 'h-16 px-8 text-[16px] rounded-2xl',
  };
  const variants = {
    primary:       'bg-ink-950 text-white hover:bg-ink-1000',
    invert:        'bg-white text-ink-950 hover:bg-ink-100',
    outline:       'bg-white text-ink-950 border border-ink-200 hover:border-ink-950',
    'outline-dark':'bg-transparent text-white border border-white/20 hover:border-white/70',
    ghost:         'bg-transparent text-ink-950 hover:bg-ink-100',
    'ghost-dark':  'bg-transparent text-white hover:bg-white/10',
    subtle:        'bg-ink-100 text-ink-950 hover:bg-ink-150',
  };
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}

export function Card({ children, className = '', as: As = 'div', ...rest }) {
  return (
    <As className={cn('bg-white border border-black/[0.08] rounded-2xl shadow-soft', className)} {...rest}>
      {children}
    </As>
  );
}

export function SectionLabel({ children, className = '' }) {
  return (
    <div className={cn('label-caps text-ink-500 flex items-center gap-2', className)}>
      <span className="w-6 h-px bg-ink-400"/>
      {children}
    </div>
  );
}

export function MonoMap({ className = '', tone = 'light' }) {
  const stroke = tone === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.10)';
  const strokeStrong = tone === 'dark' ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.32)';
  const bg = tone === 'dark' ? '#0F0F0F' : '#F4F4F4';
  return (
    <div className={cn('relative overflow-hidden rounded-2xl', className)} style={{background: bg}}>
      <svg width="100%" height="100%" viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
        {Array.from({length: 14}).map((_,i)=>(
          <line key={'h'+i} x1="0" x2="800" y1={34*i+10} y2={34*i+10} stroke={stroke} strokeWidth="1"/>
        ))}
        {Array.from({length: 22}).map((_,i)=>(
          <line key={'v'+i} x1={40*i+12} x2={40*i+12} y1="0" y2="480" stroke={stroke} strokeWidth="1"/>
        ))}
        <path d="M-20 380 L860 20" stroke={stroke} strokeWidth="14" fill="none"/>
        <path d="M-20 380 L860 20" stroke={stroke} strokeWidth="1" fill="none"/>
        <path d="M120 60 C220 120, 360 100, 440 220 S 700 320, 760 260 L 760 480 L 0 480 L 0 200 Z"
              fill={tone === 'dark' ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)'}/>
        <path className="spark-path"
              d="M 140 360 C 220 320, 260 260, 340 250 S 480 180, 560 160 L 640 110"
              stroke={strokeStrong} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="6 6"/>
        <circle cx="140" cy="360" r="7" fill={tone === 'dark' ? '#fff' : '#0A0A0A'}/>
        <circle cx="140" cy="360" r="14" fill="none" stroke={strokeStrong} strokeWidth="1"/>
        <rect x="632" y="102" width="16" height="16" rx="3" fill={tone === 'dark' ? '#fff' : '#0A0A0A'}/>
      </svg>
    </div>
  );
}

export function Sparkline({ data = [], className = '' }) {
  if (!data.length) return null;
  const w = 100, h = 32, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const dx = (w - pad*2) / (data.length - 1);
  const norm = v => h - pad - ((v - min) / (max - min || 1)) * (h - pad*2);
  const d = data.map((v,i) => `${i===0?'M':'L'} ${pad + i*dx} ${norm(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <path className="spark-path" d={d} stroke="#0A0A0A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function Sidebar({ items, active, onSelect, footer, brand = 'Swift Ride', label = 'Rider' }) {
  return (
    <aside className="w-[244px] shrink-0 bg-white border-r border-black/[0.08] flex flex-col">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-black/[0.08]">
        <Icons.Logo size={20}/>
        <span className="font-bold tracking-tightest text-[16px]">{brand}</span>
        <span className="ml-auto label-caps text-ink-500">{label}</span>
      </div>
      <nav className="p-3 flex-1 overflow-y-auto scrollbar-thin">
        <div className="label-caps text-ink-500 px-3 pt-3 pb-2">Workspace</div>
        <ul className="space-y-0.5">
          {items.map(it => (
            <li key={it.key}>
              <button
                onClick={() => onSelect && onSelect(it.key)}
                className={cn(
                  'w-full flex items-center gap-3 h-10 px-3 rounded-xl text-[14px] font-medium tab-pill',
                  active === it.key ? 'bg-ink-950 text-white' : 'text-ink-700 hover:bg-ink-100'
                )}
              >
                <span className="opacity-90"><it.icon size={16}/></span>
                <span>{it.label}</span>
                {it.badge && (
                  <span className={cn(
                    'ml-auto text-[10px] font-semibold tabular px-1.5 h-5 rounded-md inline-flex items-center',
                    active === it.key ? 'bg-white/15 text-white' : 'bg-ink-100 text-ink-700'
                  )}>
                    {it.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {footer}
    </aside>
  );
}

export function TopBar({ left, right, className = '' }) {
  return (
    <div className={cn('h-16 border-b border-black/[0.08] bg-white flex items-center px-6 lg:px-8 gap-4 shrink-0', className)}>
      {left}
      <div className="ml-auto flex items-center gap-2">{right}</div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const s = status?.toLowerCase() || '';
  const map = {
    in_transit:  'bg-ink-950 text-white',
    accepted:    'bg-ink-950 text-white',
    pickup:      'bg-ink-100 text-ink-950 border border-ink-300',
    requested:   'bg-white text-ink-700 border border-ink-300',
    completed:   'bg-white text-ink-500 border border-ink-200',
    cancelled:   'bg-white text-ink-400 border border-ink-200 line-through',
  };
  const dotMap = {
    in_transit: 'bg-white',
    accepted:   'bg-white',
    pickup:     'bg-ink-950 animate-pulse',
    requested:  'bg-ink-400 animate-pulse',
    completed:  'bg-ink-400',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 h-6 rounded-md text-[11px] font-semibold tabular', map[s] || 'bg-ink-100 text-ink-700')}>
      {s !== 'cancelled' && <span className={cn('w-1.5 h-1.5 rounded-full', dotMap[s] || 'bg-ink-400')}/>}
      {status}
    </span>
  );
}

export { cn, Avatar, Pill, Icons };
