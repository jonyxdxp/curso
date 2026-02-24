import { ThemeProvider } from './components/shared/ThemeContext';

export default function Layout({ children }) {
  return (
    <ThemeProvider>
      <ThemedApp>{children}</ThemedApp>
    </ThemeProvider>
  );
}

function ThemedApp({ children }) {
  // We read theme from localStorage directly to apply class before render
  const theme = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'dark') : 'dark';
  return (
    <div className="min-h-screen" data-theme={theme} id="theme-root">
      <style>{`
        [data-theme="light"] {
          --bg-primary: #F5F3EF;
          --bg-secondary: #EDEAE4;
          --bg-tertiary: #E5E1D8;
          --border: rgba(30, 28, 24, 0.1);
          --border-hover: rgba(30, 28, 24, 0.2);
          --text-primary: #1C1A16;
          --text-secondary: #5C5850;
          --accent: #9B7A45;
          --accent-hover: #B08A55;
          --accent-dim: rgba(155, 122, 69, 0.12);
        }
        [data-theme="dark"] {
          --bg-primary: #0B0B0D;
          --bg-secondary: #141419;
          --bg-tertiary: #1C1C23;
          --border: rgba(244, 242, 236, 0.08);
          --border-hover: rgba(244, 242, 236, 0.15);
          --text-primary: #F4F2EC;
          --text-secondary: #B8B4AA;
          --accent: #C7A36D;
          --accent-hover: #d4b07a;
          --accent-dim: rgba(199, 163, 109, 0.1);
        }
        /* Light theme overrides for hardcoded dark Tailwind classes */
        [data-theme="light"] body { background-color: #F5F3EF; color: #1C1A16; }
        [data-theme="light"] .bg-\\[\\#0B0B0D\\] { background-color: #F5F3EF !important; }
        [data-theme="light"] .bg-\\[\\#141419\\] { background-color: #EDEAE4 !important; }
        [data-theme="light"] .bg-\\[\\#0D0D10\\] { background-color: #E8E5DF !important; }
        [data-theme="light"] .bg-\\[\\#1C1C23\\] { background-color: #E5E1D8 !important; }
        [data-theme="light"] .text-\\[\\#F4F2EC\\] { color: #1C1A16 !important; }
        [data-theme="light"] .text-\\[\\#B8B4AA\\] { color: #6B6760 !important; }
        [data-theme="light"] .text-\\[\\#C7A36D\\] { color: #9B7A45 !important; }
        [data-theme="light"] .border-\\[rgba\\(244\\,242\\,236\\,0\\.08\\)\\] { border-color: rgba(30,28,24,0.1) !important; }
        [data-theme="light"] .border-\\[rgba\\(244\\,242\\,236\\,0\\.04\\)\\] { border-color: rgba(30,28,24,0.06) !important; }
        [data-theme="light"] .border-\\[rgba\\(244\\,242\\,236\\,0\\.06\\)\\] { border-color: rgba(30,28,24,0.08) !important; }
        [data-theme="light"] .border-\\[rgba\\(244\\,242\\,236\\,0\\.1\\)\\] { border-color: rgba(30,28,24,0.12) !important; }
        [data-theme="light"] .border-\\[rgba\\(244\\,242\\,236\\,0\\.12\\)\\] { border-color: rgba(30,28,24,0.15) !important; }
        [data-theme="light"] .border-\\[rgba\\(244\\,242\\,236\\,0\\.15\\)\\] { border-color: rgba(30,28,24,0.18) !important; }
        [data-theme="light"] .border-\\[rgba\\(244\\,242\\,236\\,0\\.25\\)\\] { border-color: rgba(30,28,24,0.25) !important; }
        [data-theme="light"] .bg-\\[rgba\\(199\\,163\\,109\\,0\\.1\\)\\] { background-color: rgba(155,122,69,0.12) !important; }
        [data-theme="light"] .bg-\\[rgba\\(199\\,163\\,109\\,0\\.08\\)\\] { background-color: rgba(155,122,69,0.1) !important; }
        [data-theme="light"] .bg-\\[rgba\\(199\\,163\\,109\\,0\\.15\\)\\] { background-color: rgba(155,122,69,0.15) !important; }
        [data-theme="light"] .bg-\\[rgba\\(199\\,163\\,109\\,0\\.04\\)\\] { background-color: rgba(155,122,69,0.06) !important; }
        [data-theme="light"] .bg-\\[rgba\\(199\\,163\\,109\\,0\\.06\\)\\] { background-color: rgba(155,122,69,0.08) !important; }
        [data-theme="light"] .bg-\\[rgba\\(244\\,242\\,236\\,0\\.02\\)\\] { background-color: rgba(30,28,24,0.03) !important; }
        [data-theme="light"] .bg-\\[rgba\\(244\\,242\\,236\\,0\\.03\\)\\] { background-color: rgba(30,28,24,0.04) !important; }
        [data-theme="light"] .bg-\\[rgba\\(244\\,242\\,236\\,0\\.05\\)\\] { background-color: rgba(30,28,24,0.06) !important; }
        [data-theme="light"] .bg-\\[rgba\\(244\\,242\\,236\\,0\\.06\\)\\] { background-color: rgba(30,28,24,0.07) !important; }
        [data-theme="light"] .bg-\\[rgba\\(244\\,242\\,236\\,0\\.1\\)\\] { background-color: rgba(30,28,24,0.08) !important; }
        [data-theme="light"] .hover\\:bg-\\[rgba\\(244\\,242\\,236\\,0\\.02\\)\\]:hover { background-color: rgba(30,28,24,0.04) !important; }
        [data-theme="light"] .hover\\:bg-\\[rgba\\(244\\,242\\,236\\,0\\.03\\)\\]:hover { background-color: rgba(30,28,24,0.05) !important; }
        [data-theme="light"] .hover\\:bg-\\[rgba\\(199\\,163\\,109\\,0\\.03\\)\\]:hover { background-color: rgba(155,122,69,0.06) !important; }
        [data-theme="light"] .hover\\:bg-\\[rgba\\(199\\,163\\,109,0\\.08\\)\\]:hover { background-color: rgba(155,122,69,0.1) !important; }
        [data-theme="light"] .hover\\:bg-\\[rgba\\(199\\,163\\,109\\,0\\.1\\)\\]:hover { background-color: rgba(155,122,69,0.12) !important; }
        [data-theme="light"] .bg-\\[\\#C7A36D\\] { background-color: #9B7A45 !important; }
        [data-theme="light"] .text-gradient-gold { background: linear-gradient(135deg, #9B7A45, #c4a96b, #9B7A45); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        [data-theme="light"] input, [data-theme="light"] textarea, [data-theme="light"] select { background-color: #F5F3EF !important; color: #1C1A16 !important; }
        [data-theme="light"] .bg-black { background-color: #1C1A16 !important; }
      `}</style>
      {children}
    </div>
  );
}