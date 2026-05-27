/**
 * Scrolls to a section by id, accounting for the SmoothScroll fixed container.
 * SmoothScroll uses CSS transforms rather than native scroll, so
 * scrollIntoView() and offsetTop alone don't give the right position.
 * Walking up offsetParents until we hit the fixed ancestor gives the
 * equivalent native scrollY that brings the section to the top.
 */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  let top = 0
  let current: HTMLElement | null = el
  while (current) {
    top += current.offsetTop
    const parent = current.offsetParent as HTMLElement | null
    if (!parent) break
    if (window.getComputedStyle(parent).position === "fixed") break
    current = parent
  }
  window.scrollTo({ top, behavior: "smooth" })
}
