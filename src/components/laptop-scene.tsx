import { useGLTF } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useQuery } from "convex/react"
import { MotionValue } from "motion/react"
import { Suspense, useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { api } from "../../convex/_generated/api"

// Base URL for the CDN-cached hero-video route. Prefer a Cloudflare custom
// domain (VITE_VIDEO_CDN_URL) when configured; otherwise hit the Convex HTTP
// endpoint directly. Either way the response is immutable + long-cached.
const VIDEO_CDN_BASE: string =
  import.meta.env.VITE_VIDEO_CDN_URL ?? import.meta.env.VITE_CONVEX_SITE_URL ?? ""

// Resolve the screen video URL, or null when no custom video has been selected
// in the admin (in which case the iMac keeps its baked-in GLB screen texture).
function heroVideoSrc(storageId: string | null | undefined): string | null {
  if (!storageId) return null
  return `${VIDEO_CDN_BASE}/hero-video?id=${storageId}`
}

// ─── Screen Video Texture ───────────────────────────────────────────────────
// Builds a looping, muted video element + texture for the iMac display.
// Muted + playsInline are required for autoplay; we also retry play() on the
// first user interaction in case the browser still blocks it. Returns null when
// there is no video source, leaving the model's original screen texture intact.
function useScreenVideoTexture(src: string | null) {
  return useMemo(() => {
    if (!src) return null
    const video = document.createElement("video")
    video.src = src
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.crossOrigin = "anonymous"
    video.preload = "auto"

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay blocked — wait for a user gesture, then try once more.
        const resume = () => {
          video.play().catch(() => {})
          window.removeEventListener("pointerdown", resume)
        }
        window.addEventListener("pointerdown", resume, { once: true })
      })
    }
    tryPlay()

    const texture = new THREE.VideoTexture(video)
    texture.colorSpace = THREE.SRGBColorSpace
    // The screen UVs expect a flipped texture — without this the video plays
    // upside-down. (VideoTexture defaults to flipY = false.)
    texture.flipY = true

    return { video, texture }
  }, [src])
}

// ─── Loaded Laptop Model ────────────────────────────────────────────────────
function Laptop({
  scrollProgress,
  videoSrc,
}: {
  scrollProgress: MotionValue<number>
  videoSrc: string | null
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene: originalScene } = useGLTF("/imac.glb")
  const scene = useMemo(() => {
    const clone = originalScene.clone(true)
    clone.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      const makeBlack = (material: THREE.Material) =>
        material.name === "GlassBlack"
          ? new THREE.MeshBasicMaterial({ color: 0x000000, side: material.side })
          : material
      obj.material = Array.isArray(obj.material)
        ? obj.material.map(makeBlack)
        : makeBlack(obj.material)
    })
    return clone
  }, [originalScene])
  const screen = useScreenVideoTexture(videoSrc)

  // Swap the "DisplayImage" material's textures for the live video texture.
  // The screen material is emissive, so the video glows on its own like a real
  // display rather than depending on scene lighting. With no video selected we
  // leave the model's original baked screen texture in place.
  useEffect(() => {
    if (!screen) return
    const { video, texture } = screen
    const backings: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>[] = []
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
      for (const material of materials) {
        if (material?.name !== "DisplayImage") continue
        const m = material as THREE.MeshStandardMaterial
        obj.geometry.computeBoundingBox()
        const displayWidth = obj.geometry.boundingBox?.getSize(new THREE.Vector3()).x ?? 0
        const backing = new THREE.Mesh(
          obj.geometry,
          new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }),
        )
        backing.position.y = -displayWidth * 0.0005
        obj.parent?.add(backing)
        backings.push(backing)
        obj.position.x = -displayWidth * 0.005
        obj.position.y = -displayWidth * 0.001
        m.map = texture
        m.emissiveMap = texture
        m.emissive = new THREE.Color(0xffffff)
        m.emissiveIntensity = 1
        m.needsUpdate = true
      }
    })

    return () => {
      for (const backing of backings) {
        backing.removeFromParent()
        backing.material.dispose()
      }
      texture.dispose()
      video.pause()
      video.removeAttribute("src")
      video.load()
    }
  }, [scene, screen])

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
function Scene({
  scrollProgress,
  videoSrc,
}: {
  scrollProgress: MotionValue<number>
  videoSrc: string | null
}) {
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
      <spotLight position={[0, 5, -5]} angle={0.5} penumbra={1} intensity={0.4} color="#334455" />

      <Suspense fallback={null}>
        <Laptop scrollProgress={scrollProgress} videoSrc={videoSrc} />
      </Suspense>
    </>
  )
}

// ─── Exported Canvas Wrapper ────────────────────────────────────────────────
export function LaptopScene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const dpr = Math.min(window.devicePixelRatio, 2)
  // Read the admin-selected video here (outside <Canvas>) — React context such
  // as the Convex provider does not cross the react-three-fiber renderer
  // boundary, so the query must run in the regular tree and pass down as a prop.
  const homepage = useQuery(api.homepage.get)
  const videoSrc = heroVideoSrc(homepage?.heroVideo)

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, -0.1, 5], fov: 45 }}
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene scrollProgress={scrollProgress} videoSrc={videoSrc} />
    </Canvas>
  )
}
