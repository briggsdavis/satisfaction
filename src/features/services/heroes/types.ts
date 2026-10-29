import type { Service } from "../../../lib/types"

export type HeroProps = {
  service: Service
  /** Present in edit mode: commit a new display name. */
  onName?: (name: string) => void
}
