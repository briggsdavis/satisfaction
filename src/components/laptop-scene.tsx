import { useGLTF } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { MotionValue } from "motion/react"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"

// ─── Loaded Laptop Model ────────────────────────────────────────────────────
function Laptop({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene: originalScene } = useGLTF("/imac.glb")
  const scene = useMemo(() => originalScene.clone(true), [originalScene])

  // Derive normalization transform from the original geometry (immutable)
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const s = 2 / maxDim
    return {
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -center.y * s, -center.z * s),
    }
  }, [scene])

  // Animate laptop position and rotation based on scroll.
  // Starts facing directly at viewer; drifts to a ~20° horizontal angle —
  // like sitting in a room at eye-level but off to the side of the monitor.
  useFrame(() => {
    if (!groupRef.current) return
    const t = scrollProgress.get()

    groupRef.current.position.z = THREE.MathUtils.lerp(-18, 2.415, t)
    groupRef.current.position.y = THREE.MathUtils.lerp(0, -0.13, t)
    // Keep X near zero — viewer is at the same height as the monitor
    groupRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.04, t)
    // Y: 0° (facing you) → ~20° (horizontal drift, at an angle to you)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(0, 0.35, t)
  })

  return (
    <group ref={groupRef}>
      <group scale={scale} position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

// Preload the model
useGLTF.preload("/imac.glb")

// ─── Scene ──────────────────────────────────────────────────────────────────
function Scene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  return (
    <>
      <fog attach="fog" args={["#000000", 10, 25]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 3, -2]} intensity={0.6} color="#4466ff" />
      <pointLight position={[3, 2, 2]} intensity={0.5} color="#ffffff" />

      {/* Subtle rim light */}
      <spotLight
        position={[0, 5, -5]}
        angle={0.5}
        penumbra={1}
        intensity={0.4}
        color="#334455"
      />

      <Suspense fallback={null}>
        <Laptop scrollProgress={scrollProgress} />
      </Suspense>
    </>
  )
}

// ─── Exported Canvas Wrapper ────────────────────────────────────────────────
export function LaptopScene({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>
}) {
  const dpr = Math.min(window.devicePixelRatio, 2)

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, -0.1, 5], fov: 45 }}
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene scrollProgress={scrollProgress} />
    </Canvas>
  )
}
