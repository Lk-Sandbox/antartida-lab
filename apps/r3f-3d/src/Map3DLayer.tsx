import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { CanvasTexture, SRGBColorSpace, Vector3, type Texture } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { EXPEDITION_POINT, mapSvgDocument, type Geometry, type Marker, type Size, type View } from '@antartida/core';
import { MarkerButton, useReducedMotion, type Anim, type LayerProps, type Phase } from '@antartida/react-ui';

const FOV = 40;
/** Map units of margin around 0..1000 so Tierra del Fuego and the halo fit in the texture. */
const PAD = 250;
const PLANE = 1000 + 2 * PAD;
const ZOOM_MS = 450;
const DIVE_MS = 1500;

interface Pose { pos: Vector3; target: Vector3 }

const toWorld = (x: number, y: number) => new Vector3(x - 500, 0, y - 500);

/**
 * Top-down camera that frames the plane exactly like the 2D layer frames the SVG for the
 * same view, so clustering, labels and gestures from core apply unchanged.
 */
function poseFromView(size: Size, geo: Geometry, view: View): Pose {
  const pxPerUnit = (geo.S * view.k) / 1000;
  const h = size.vh / (2 * Math.tan((FOV * Math.PI) / 360) * pxPerUnit);
  const target = toWorld((size.vw / 2 - geo.ox - view.px) / pxPerUnit, (size.vh / 2 - geo.oy - view.py) / pxPerUnit);
  return { pos: target.clone().setY(h), target };
}

/** The "descent": low, tilted camera south of Marambio looking north over the island. */
const DIVE_POSE: Pose = (() => {
  const target = toWorld(EXPEDITION_POINT.x, EXPEDITION_POINT.y);
  return { pos: target.clone().add(new Vector3(0, 55, 105)), target };
})();

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function CameraRig({ size, geo, view, anim, phase, reduced }: {
  size: Size; geo: Geometry; view: View; anim: Anim; phase: Phase; reduced: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const current = useRef<Pose | null>(null);
  const tween = useRef<{ from: Pose; to: Pose; start: number; dur: number } | null>(null);

  const apply = (p: Pose) => {
    current.current = { pos: p.pos.clone(), target: p.target.clone() };
    camera.position.copy(p.pos);
    camera.up.set(0, 0, -1);
    camera.lookAt(p.target);
  };

  useLayoutEffect(() => {
    if (phase === 'fade') return;
    const to = phase === 'dive' ? DIVE_POSE : poseFromView(size, geo, view);
    const dur = phase === 'dive' ? DIVE_MS : anim === 'zoom' ? ZOOM_MS : 0;
    if (!current.current || reduced || dur === 0) {
      tween.current = null;
      apply(to);
    } else {
      tween.current = { from: current.current, to, start: performance.now(), dur };
    }
    invalidate();
  }, [size, geo, view, anim, phase, reduced]);

  useFrame(() => {
    const tw = tween.current;
    if (!tw) return;
    const t = Math.min(1, (performance.now() - tw.start) / tw.dur);
    const k = ease(t);
    apply({ pos: tw.from.pos.clone().lerp(tw.to.pos, k), target: tw.from.target.clone().lerp(tw.to.target, k) });
    if (t < 1) invalidate();
    else tween.current = null;
  });
  return null;
}

async function rasterizeMap(size: number): Promise<Texture> {
  const url = URL.createObjectURL(new Blob([await mapSvgDocument(size, PAD)], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    canvas.getContext('2d')!.drawImage(img, 0, 0, size, size);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** The painted SVG map, rasterized once into a texture on a flat plane. */
function MapPlane({ wide }: { wide: boolean }) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const maxSize = useThree((s) => s.gl.capabilities.maxTextureSize);
  useEffect(() => {
    let alive = true;
    rasterizeMap(Math.min(maxSize, wide ? 4096 : 2048)).then((t) => {
      if (alive) {
        setTexture(t);
        invalidate();
      }
    });
    return () => { alive = false; };
  }, [maxSize, wide, invalidate]);
  return (
    <mesh rotation-x={-Math.PI / 2} visible={!!texture}>
      <planeGeometry args={[PLANE, PLANE]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function Marker3D({ m, onPick, portal }: { m: Marker; onPick: (m: Marker) => void; portal: RefObject<HTMLDivElement | null> }) {
  return (
    <Html position={toWorld(m.x, m.y)} portal={portal as RefObject<HTMLElement>} zIndexRange={[2, 1]} style={{ pointerEvents: 'none' }}>
      <MarkerButton m={m} style={{ left: 0, top: 0 }} onPick={onPick} />
    </Html>
  );
}

export default function Map3DLayer({ size, geo, view, anim, phase, markers, onPick }: LayerProps) {
  const reduced = useReducedMotion();
  // Markers live in our own overlay, not inside the canvas wrapper, so teardown order never matters.
  const overlay = useRef<HTMLDivElement>(null);
  return (
    <>
    <Canvas
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: FOV, near: 1, far: 20000, position: [0, 3000, 0] }}
      aria-hidden="true"
    >
      <MapPlane wide={size.vw > 820} />
      <CameraRig size={size} geo={geo} view={view} anim={anim} phase={phase} reduced={reduced} />
      {phase !== 'dive' && markers.map((m) => <Marker3D key={m.key} m={m} onPick={onPick} portal={overlay} />)}
    </Canvas>
    <div className="ov" ref={overlay} />
    </>
  );
}
