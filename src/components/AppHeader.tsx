interface AppHeaderProps {
  pageTitle?: string;
  backButton?: () => void;
  rightAction?: { label: string; onClick: () => void };
}

export default function AppHeader({ pageTitle, backButton, rightAction }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-brand">
        {backButton && (
          <button className="header-back" onClick={backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div className="brand-logo">
          <svg className="brand-leaf brand-leaf-left" viewBox="0 0 24 24" fill="none">
            <path d="M2 22c0 0 2-4 4-8c2-4 6-8 12-10c0 0-2 6-4 10s-6 6-12 8z" fill="var(--green-600)" opacity="0.7"/>
            <path d="M4 20c2-3 5-7 10-9" stroke="var(--green-400)" strokeWidth="1" fill="none" opacity="0.5"/>
            <path d="M6 18c0 0 1-4 3-6c2-2 5-4 9-5c0 0-1 4-3 6s-5 4-9 5z" fill="var(--green-500)" opacity="0.5"/>
          </svg>
          <span className="brand-text">MANO VERDE</span>
          <svg className="brand-leaf brand-leaf-right" viewBox="0 0 24 24" fill="none">
            <path d="M22 22c0 0-2-4-4-8c-2-4-6-8-12-10c0 0 2 6 4 10s6 6 12 8z" fill="var(--green-600)" opacity="0.7"/>
            <path d="M20 20c-2-3-5-7-10-9" stroke="var(--green-400)" strokeWidth="1" fill="none" opacity="0.5"/>
            <path d="M18 18c0 0-1-4-3-6c-2-2-5-4-9-5c0 0 1 4 3 6s5 4 9 5z" fill="var(--green-500)" opacity="0.5"/>
          </svg>
        </div>
        {rightAction && (
          <button className="header-action" onClick={rightAction.onClick}>
            {rightAction.label}
          </button>
        )}
      </div>
      {/* Smooth arch — same pattern as Mint's ellipse */}
      <div className="app-header-arch">
        <svg viewBox="0 0 100 56" preserveAspectRatio="none">
          <ellipse cx="50" cy="56" rx="56" ry="56" fill="var(--bg-primary)" />
        </svg>
      </div>
    </header>
  );
}
