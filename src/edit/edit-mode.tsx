import { createContext, use, type ReactNode } from "react"

// Public pages render read-only. Admin editors wrap the same components in
// <EditMode>, which turns Editable* primitives and edit affordances on.
const EditContext = createContext(false)

export const EditMode = ({ children }: { children: ReactNode }) => (
  <EditContext value={true}>
    <div
      onClickCapture={(event) => {
        if ((event.target as Element).closest("a[href]")) event.preventDefault()
      }}
    >
      {children}
    </div>
  </EditContext>
)

export const useEditing = () => use(EditContext)
