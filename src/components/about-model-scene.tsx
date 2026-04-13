import { Environment, useGLTF } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

// ─── Loaded GLTF Model ─────────────────────────────────────────────────────
function Model() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene: originalScene } = useGLTF("/model.gltf")
  const scene = useMemo(() => {
    const cloned = originalScene.clone(true)
    // Reset any baked-in rotation from the GLTF node hierarchy
    // so the model faces the camera head-on
    cloned.rotation.set(0, 0, 0)
    cloned.updateMatrixWorld(true)
    return cloned
  }, [originalScene])

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
    const maxAngle = 0.06 // ±0.06 rad (~3.4°) — very subtle
    const damping = 0.03

    const targetY = mouse.current.x * maxAngle
    const targetX = -mouse.current.y * maxAngle

    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * damping
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * damping
  })

  return (
    <group ref={groupRef}>
      <group scale={scale} position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

useGLTF.preload("/model.gltf")

// ─── Scene ──────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Environment map — required for KHR_materials_transmission (glass)
          to have something to refract. Without this, transmission materials
          render flat/dark since the refraction buffer is empty. */}
      <Environment preset="city" />

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

      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </>
  )
}

// ─── Exported Canvas Wrapper ────────────────────────────────────────────────
export function AboutModelScene() {
  const dpr = Math.min(window.devicePixelRatio, 2)

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 45 }}
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  )
}
