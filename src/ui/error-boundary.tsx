import { Component, type ReactNode } from "react"

/** Swallows render errors in a subtree (e.g. WebGL), rendering `fallback`. */
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError = () => ({ failed: true })
  render = () => (this.state.failed ? (this.props.fallback ?? null) : this.props.children)
}
