import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { AntarcticaApp, type LayerProps } from '@antartida/react-ui';
import '@antartida/core/styles/index.css';
import './r3f.css';

const Map3DLayer = lazy(() => import('./Map3DLayer.tsx'));

function Layer3D(props: LayerProps) {
  return (
    <Suspense fallback={null}>
      <Map3DLayer {...props} />
    </Suspense>
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

// Without WebGL the list is the whole interface: same flow, no map.
const webgl = hasWebGL();
createRoot(document.getElementById('root')!).render(<AntarcticaApp layer={webgl ? Layer3D : undefined} forceList={!webgl} />);
