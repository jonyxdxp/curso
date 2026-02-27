import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggle, isDark } = useTheme();
  return (
    <button
      onClick={toggle}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-200 ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}