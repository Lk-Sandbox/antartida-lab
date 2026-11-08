import { Icon } from '../ui.tsx';

export function Legend({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="legend">
      <button type="button" className="lt" onClick={onToggle} aria-expanded={open}>
        {Icon.legend}
        Leyenda
      </button>
      {open && (
        <ul>
          <li><span className="sw"><span className="a" /></span><span><b>Expedición disponible</b></span></li>
          <li><span className="sw"><span className="b" /></span><span>Ampliación prevista</span></li>
          <li><span className="sw"><span className="c" /></span><span>Próximamente</span></li>
        </ul>
      )}
    </div>
  );
}
