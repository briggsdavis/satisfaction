import type { CSSProperties, ReactNode } from "react"
import { galleryTemplates, positionedFrames } from "../../convex/lib/gallery"
import type { GalleryOrientation, GalleryTemplate } from "../../convex/model"

/**
 * Lays out `slotCount` slots as repeating template batches. Below 700px of
 * container width frames stack; above it they're absolutely placed (see CSS).
 * `isVisible` hides frames (and trims batch height) on the public site.
 */
export const GalleryGrid = ({
  template,
  orientation = "original",
  slotCount,
  busy = false,
  isVisible,
  renderFrame,
}: {
  template: GalleryTemplate
  orientation?: GalleryOrientation
  slotCount: number
  busy?: boolean
  isVisible?: (index: number) => boolean
  renderFrame: (index: number) => ReactNode
}) => {
  const { width, height, gutter, frames } = galleryTemplates[template]
  const positioned = positionedFrames(template, orientation)
  const batches = Math.max(1, Math.ceil(slotCount / frames.length))

  return (
    <div className="gallery-template">
      {Array.from({ length: batches }, (_, batch) => {
        const offset = batch * frames.length
        const visible = positioned.filter((f) => !isVisible || isVisible(offset + f.index))
        if (!visible.length) return null
        const visibleHeight = isVisible ? Math.max(...visible.map((f) => f.y + f.height)) : height
        return (
          <div
            key={batch}
            aria-busy={busy}
            className="gallery-template-canvas"
            style={
              {
                "--template-width": width + gutter,
                "--template-height": visibleHeight + gutter,
                "--template-gutter": `${gutter}px`,
              } as CSSProperties
            }
          >
            {visible.map((frame) => (
              <div
                key={offset + frame.index}
                className="gallery-template-frame group relative overflow-hidden rounded-[16px]"
                style={
                  {
                    "--frame-x": frame.x,
                    "--frame-y": frame.y,
                    "--frame-width": frame.width + gutter,
                    "--frame-height": frame.height + gutter,
                    aspectRatio: frame.width / frame.height,
                  } as CSSProperties
                }
              >
                {renderFrame(offset + frame.index)}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/** Slot indices in visual reading order (for lightbox sequencing). */
export const readingOrder = (
  template: GalleryTemplate,
  orientation: GalleryOrientation,
  slotCount: number,
) => {
  const size = galleryTemplates[template].frames.length
  const positioned = positionedFrames(template, orientation)
  return Array.from({ length: Math.ceil(slotCount / size) }, (_, batch) =>
    positioned.map((f) => batch * size + f.index),
  ).flat()
}
