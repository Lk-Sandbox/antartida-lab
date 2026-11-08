export const EXPLORED_KEY = 'antartida:explored';

export function loadExplored(): boolean {
  try {
    return localStorage.getItem(EXPLORED_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveExplored(value: boolean): void {
  try {
    localStorage.setItem(EXPLORED_KEY, value ? '1' : '0');
  } catch {
    // Storage unavailable (private mode, blocked cookies): keep the in-memory state only.
  }
}
