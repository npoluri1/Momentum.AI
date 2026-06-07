import { useEffect } from 'react';

interface Handlers {
  onQuickSearch?: () => void;
  onShowHelp?: () => void;
}

export function useEditorShortcuts({ onQuickSearch, onShowHelp }: Handlers = {}) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onQuickSearch?.();
      }
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        onShowHelp?.();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onQuickSearch, onShowHelp]);
}

