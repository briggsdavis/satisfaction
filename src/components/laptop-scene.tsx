import { useGLTF } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { MotionValue } from "motion/react"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"

// ─── Loaded Laptop Model ────────────────────────────────────────────────────
function Laptop({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene: originalScene } = useGLTF("/macbook.glb")
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

  // Animate laptop position and rotation based on scroll
  useFrame(() => {
    if (!groupRef.current) return
    const t = scrollProgress.get()

    // Start far away, come close to fill the screen
    groupRef.current.position.z = THREE.MathUtils.lerp(-15, 2.5, t)
    // Lower the laptop so the screen ends up at eye level when close
    groupRef.current.position.y = THREE.MathUtils.lerp(0, 0.1, t)
    // Slight tilt throughout
    groupRef.current.rotation.x = THREE.MathUtils.lerp(0.25, 0.1, t)
    // Slight Y rotation at start for visual interest
    groupRef.current.rotation.y = THREE.MathUtils.lerp(0.35, 0, t)
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
useGLTF.preload("/macbook.glb")

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
