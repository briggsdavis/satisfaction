import { Environment, useGLTF } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

// ─── Loaded GLTF Model ─────────────────────────────────────────────────────
function Model() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene: originalScene } = useGLTF("/v6U0l01.glb")
  const scene = useMemo(() => originalScene.clone(true), [originalScene])

  // Normalize geometry — center and scale to fit in a 2-unit box
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const s = maxDim > 0 ? 2 / maxDim : 1
    return {
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -center.y * s, -center.z * s),
    }
  }, [scene])

  // Boost emissive so the black metallic model is visible on a dark background
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.emissive.set(0x333333)
            mat.emissiveIntensity = 0.4
            mat.needsUpdate = true
          }
        })
      }
    })
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
    const maxAngle = 0.3
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
      <group scale={scale} position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

useGLTF.preload("/v6U0l01.glb")

// ─── Scene ──────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 3]} intensity={6} color="#ffffff" />
      <directionalLight position={[-4, 2, 2]} intensity={3} color="#aabbff" />
      <directionalLight position={[2, -2, -4]} intensity={2} color="#ffffff" />

      <Suspense fallback={null}>
        <Environment files="/environement.hdr" background={false} />
        <Model />
      </Suspense>
    </>
  )
}

// ─── Exported Canvas Wrapper ────────────────────────────────────────────────
export function AboutModelScene() {
  const dpr = Math.min(window.devicePixelRatio, 1.5)

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  )
}
