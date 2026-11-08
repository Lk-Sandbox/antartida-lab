import { lazy, Suspense, useEffect, useState } from 'react';
import { DIVE_MS, FADE_MS, RETURN_MS, RETURN_TOAST, TOAST_MS, loadExplored, saveExplored } from '@antartida/core';
import { useReducedMotion, useTimers } from './hooks.ts';
import { MapView, type Phase } from './map/MapView.tsx';
import { Filters } from './ui.tsx';

const loadExpedition = () => import('./expedition/Expedition.tsx');
const Expedition = lazy(() => loadExpedition().then((m) => ({ default: m.Expedition })));

export function AntarcticaApp() {
  const [screen, setScreen] = useState<'map' | 'exp'>('map');
  const [phase, setPhase] = useState<Phase>('idle');
  const [explored, setExplored] = useState(false);
  const [toast, setToast] = useState('');
  const [legend, setLegend] = useState(true);
  const [returned, setReturned] = useState(false);
  const reduced = useReducedMotion();
  const later = useTimers();

  useEffect(() => setExplored(loadExplored()), []);

  const start = () => {
    if (phase !== 'idle') return;
    setToast('');
    void loadExpedition();
    setPhase(reduced ? 'fade' : 'dive');
    later('enter', () => {
      setScreen('exp');
      setPhase('idle');
    }, reduced ? FADE_MS : DIVE_MS);
  };

  const leave = (done: boolean) => {
    if (done) {
      setExplored(true);
      saveExplored(true);
    }
    setScreen('map');
    setPhase('ret');
    setReturned(true);
    setToast(done ? RETURN_TOAST : '');
    later('ret', () => setPhase('idle'), RETURN_MS);
    if (done) later('toast', () => setToast(''), TOAST_MS);
  };

  return (
    <div className="app">
      <Filters />
      {screen === 'map' ? (
        <MapView
          phase={phase}
          explored={explored}
          toast={toast}
          legend={legend}
          focusExpedition={returned}
          onToggleLegend={() => setLegend((l) => !l)}
          onStart={start}
        />
      ) : (
        <Suspense fallback={null}>
          <Expedition reduced={reduced} onLeave={leave} />
        </Suspense>
      )}
    </div>
  );
}
