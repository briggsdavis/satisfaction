import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react"
import { useId } from "react"

const legacyTextToHtml = (value: string) => {
  if (/<[a-z][\s\S]*>/i.test(value)) return value
  const container = document.createElement("div")
  for (const paragraph of value.split(/\n{2,}/)) {
    const node = document.createElement("p")
    node.append(...paragraph.split("\n").flatMap((line, index) => [index ? document.createElement("br") : "", line]))
    container.append(node)
  }
  return container.innerHTML
}

type Props = {
  label: string
  value: string
  onCommit: (value: string) => void
}

export const RichTextField = ({ label, value, onCommit }: Props) => {
  const id = useId()
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2] } })],
    content: legacyTextToHtml(value),
    onBlur: ({ editor }) => {
      const next = editor.isEmpty ? "" : editor.getHTML()
      if (next !== value) onCommit(next)
    },
  })
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      heading: editor?.isActive("heading", { level: 2 }) ?? false,
      bulletList: editor?.isActive("bulletList") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      blockquote: editor?.isActive("blockquote") ?? false,
      canUndo: editor?.can().undo() ?? false,
      canRedo: editor?.can().redo() ?? false,
    }),
  })

  if (!editor) return null

  const controls = [
    { label: "Bold", icon: Bold, active: state.bold, action: () => editor.chain().focus().toggleBold().run() },
    { label: "Italic", icon: Italic, active: state.italic, action: () => editor.chain().focus().toggleItalic().run() },
    { label: "Heading", icon: Heading2, active: state.heading, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Bulleted list", icon: List, active: state.bulletList, action: () => editor.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", icon: ListOrdered, active: state.orderedList, action: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Quote", icon: Quote, active: state.blockquote, action: () => editor.chain().focus().toggleBlockquote().run() },
  ]

  return (
    <div className="border-b border-white/10 py-4">
      <label htmlFor={id} className="mb-2 block text-xs font-bold tracking-[0.35em] text-white/40 uppercase">
        {label}
      </label>
      <div className="border border-white/20 focus-within:border-white/50">
        <div className="flex items-center gap-1 border-b border-white/10 p-1">
          {controls.map(({ label, icon: Icon, active, action }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              aria-pressed={active}
              onMouseDown={(event) => event.preventDefault()}
              onClick={action}
              className={`flex h-8 w-8 items-center justify-center transition-colors ${active ? "bg-white text-black" : "text-white/50 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon size={14} />
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-white/10" />
          <button type="button" aria-label="Undo" disabled={!state.canUndo} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().undo().run()} className="flex h-8 w-8 items-center justify-center text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-20">
            <Undo2 size={14} />
          </button>
          <button type="button" aria-label="Redo" disabled={!state.canRedo} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().redo().run()} className="flex h-8 w-8 items-center justify-center text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-20">
            <Redo2 size={14} />
          </button>
        </div>
        <EditorContent id={id} editor={editor} className="rich-text-editor" />
      </div>
    </div>
  )
}
