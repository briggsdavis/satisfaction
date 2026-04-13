import { Environment, useGLTF } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

// ─── Loaded GLTF Model ─────────────────────────────────────────────────────
function Model({ onReady }: { onReady?: () => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const readyFired = useRef(false)
  const { scene: originalScene } = useGLTF("/model.gltf")
  const scene = useMemo(() => originalScene.clone(true), [originalScene])

  // Normalize geometry — center and scale to fit in a 2-unit box
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

  // Mouse tracking: normalized to [-1, 1]
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  // Smooth rotation toward mouse position each frame
  useFrame(() => {
    if (!groupRef.current) return

    // Signal that the scene has actually rendered
    if (!readyFired.current) {
      readyFired.current = true
      onReady?.()
    }

    const maxAngle = 0.15 // ±0.15 rad (~8.6°) — clearly noticeable
    const damping = 0.08

    const targetY = mouse.current.x * maxAngle
    const targetX = -mouse.current.y * maxAngle

    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * damping
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * damping
  })

  return (
    <group ref={groupRef}>
      {/* Counter-rotate the 45° Y rotation baked into GLTF node 10 */}
      <group rotation={[0, -Math.PI / 4, 0]}>
        <group scale={scale} position={offset}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload("/model.gltf")

// ─── Scene ──────────────────────────────────────────────────────────────────
function Scene({ onReady }: { onReady?: () => void }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 3, -2]} intensity={0.6} color="#4466ff" />
      <pointLight position={[3, 2, 2]} intensity={0.5} color="#ffffff" />
      <spotLight
        position={[0, 5, -5]}
        angle={0.5}
        penumbra={1}
        intensity={0.4}
        color="#334455"
      />

      {/* Environment + Model in same Suspense so both must load before render */}
      <Suspense fallback={null}>
        <Environment preset="city" background={false} />
        <Model onReady={onReady} />
      </Suspense>
    </>
  )
}

// ─── Exported Canvas Wrapper ────────────────────────────────────────────────
export function AboutModelScene({
  onReady,
}: {
  onReady?: () => void
}) {
  const dpr = Math.min(window.devicePixelRatio, 2)

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 45 }}
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene onReady={onReady} />
    </Canvas>
  )
}
