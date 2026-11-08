import type { Marker } from '@antartida/core';
import { Icon } from '../ui.tsx';

export function Markers({ markers, className, onPick }: {
  markers: Marker[];
  className: string;
  onPick: (m: Marker) => void;
}) {
  return (
    <div className={className}>
      {markers.map((m) => (
        <button
          key={m.key}
          type="button"
          className={m.cls}
          style={{ left: m.left + 'px', top: m.top + 'px' }}
          onClick={() => onPick(m)}
          aria-label={m.aria}
        >
          <span className="dot">
            {m.kind === 'cluster' && m.count}
            {m.kind === 'point' && m.pulse && <span className="pulse" />}
            {m.kind === 'point' && m.check && Icon.check}
          </span>
          {m.kind === 'point' && m.label && (
            <span className="mlabel"><strong>{m.label.title}</strong><span>{m.label.sub}</span></span>
          )}
        </button>
      ))}
    </div>
  );
}
