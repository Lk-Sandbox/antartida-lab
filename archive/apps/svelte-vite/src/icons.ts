const s = 'stroke="#1F2A36" stroke-linecap="round"';

/** Inline icon markup, identical to react-ui's Icon set. */
export const ICONS = {
  plus: `<path d="M12 5v14M5 12h14" ${s} stroke-width="2.4"/>`,
  minus: `<path d="M5 12h14" ${s} stroke-width="2.4"/>`,
  reset: `<circle cx="12" cy="12" r="7.5" stroke="#1F2A36" stroke-width="2" fill="none"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" ${s} stroke-width="2"/>`,
  close: `<path d="M6 6l12 12M18 6L6 18" ${s} stroke-width="2.4"/>`,
  legend: `<path d="M5 7h14M5 12h14M5 17h9" ${s} stroke-width="2" fill="none"/>`,
  list: `<path d="M8 6h12M8 12h12M8 18h12" ${s} stroke-width="2" fill="none"/><circle cx="4" cy="6" r="1.5" fill="#1F2A36"/><circle cx="4" cy="12" r="1.5" fill="#1F2A36"/><circle cx="4" cy="18" r="1.5" fill="#1F2A36"/>`,
  back: `<path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  check: `<path d="M2.5,7.5 L5.8,10.5 L11.5,3.5" fill="none" stroke="#1F2A36" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
};
