import { useMutation } from "convex/react"
import type { Infer } from "convex/values"
import { useState, type FormEvent } from "react"
import { api } from "../../../convex/_generated/api"
import type { leadKind } from "../../../convex/model"

/** Off-screen field humans never see; bots fill it and get silently dropped. */
export const Honeypot = () => (
  <input
    name="website"
    tabIndex={-1}
    autoComplete="off"
    aria-hidden
    className="absolute -left-[9999px] h-px w-px opacity-0"
  />
)

/** Submits any form as a lead: `name` + `email` required, every other field kept verbatim. */
export const useLeadForm = (kind: Infer<typeof leadKind>) => {
  const submit = useMutation(api.leads.submit)
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<unknown>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fields: Record<string, string> = {}
    for (const [key, value] of new FormData(event.currentTarget))
      if (typeof value === "string" && value)
        fields[key] = fields[key] ? `${fields[key]}, ${value}` : value
    const { name = "", email = "", ...rest } = fields
    setState("sending")
    setError(null)
    try {
      await submit({ kind, name, email, fields: rest })
      setState("sent")
    } catch (cause) {
      setError(cause)
      setState("idle")
    }
  }

  const reset = () => {
    setState("idle")
    setError(null)
  }

  return { onSubmit, state, error, reset }
}
