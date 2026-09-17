import type { CSSProperties, ReactNode } from "react"
import {
  galleryTemplates,
  type GalleryOrientation,
  type GalleryTemplateId,
} from "../../convex/lib/gallery"

export const getTemplateFrames = (template: GalleryTemplateId, orientation: GalleryOrientation) => {
  const { width, height, frames } = galleryTemplates[template]
  const flipX = orientation === "horizontal" || orientation === "both"
  const flipY = orientation === "vertical" || orientation === "both"
  return frames
    .map((frame, index) => ({
      ...frame,
      index,
      x: flipX ? width - frame.x - frame.width : frame.x,
      y: flipY ? height - frame.y - frame.height : frame.y,
    }))
    .sort((a, b) => a.y - b.y || a.x - b.x)
}

export const GalleryTemplateGrid = ({
  template,
  orientation = "original",
  slotCount,
  busy = false,
  isFrameVisible,
  renderFrame,
}: {
  template: GalleryTemplateId
  orientation?: GalleryOrientation
  slotCount: number
  busy?: boolean
  isFrameVisible?: (index: number) => boolean
  renderFrame: (index: number) => ReactNode
}) => {
  const { width, height, gutter, frames } = galleryTemplates[template]
  const positioned = getTemplateFrames(template, orientation)
  const batches = Math.max(1, Math.ceil(slotCount / frames.length))

  return (
    <div className="gallery-template">
      {Array.from({ length: batches }, (_, batch) => {
        const visibleFrames = positioned.filter((frame) =>
          isFrameVisible ? isFrameVisible(batch * frames.length + frame.index) : true,
        )
        if (!visibleFrames.length) return null
        const visibleHeight = isFrameVisible
          ? Math.max(...visibleFrames.map((frame) => frame.y + frame.height))
          : height

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
            {visibleFrames.map((frame) => {
              const index = batch * frames.length + frame.index
              return (
                <div
                  key={index}
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
                  {renderFrame(index)}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
