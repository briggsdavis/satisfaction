import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { ConvexTextareaField, ConvexTextField } from "../../components/convex-text-field"
import { BackButton, SectionHeader } from "../../components/misc"

export const WhatWeDoAdmin = () => {
  const homepage = useQuery(api.homepage.get)
  const patch = useMutation(api.homepage.patch)

  if (homepage === undefined) return null

  return (
    <div className="max-w-2xl">
      <BackButton to="/admin/homepage" label="Homepage" />
      <SectionHeader
        title="What We Do / Why We're Different"
        description="Two-panel scroll section on the homepage."
      />

      <div className="mb-8">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          Panel 1 — What We Do
        </p>
        <ConvexTextareaField
          label="Body Text"
          value={homepage?.whatWeDoPanel1Body ?? ""}
          onCommit={(v) => patch({ whatWeDoPanel1Body: v })}
          rows={5}
        />
      </div>

      <div>
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          Panel 2 — Why We're Different
        </p>
        <ConvexTextField
          label="Left Column Label"
          value={homepage?.whatWeDoPanel2Col1Label ?? ""}
          onCommit={(v) => patch({ whatWeDoPanel2Col1Label: v })}
        />
        <ConvexTextareaField
          label="Left Column Body"
          value={homepage?.whatWeDoPanel2Col1Body ?? ""}
          onCommit={(v) => patch({ whatWeDoPanel2Col1Body: v })}
          rows={4}
        />
        <ConvexTextField
          label="Right Column Label"
          value={homepage?.whatWeDoPanel2Col2Label ?? ""}
          onCommit={(v) => patch({ whatWeDoPanel2Col2Label: v })}
        />
        <ConvexTextareaField
          label="Right Column Body"
          value={homepage?.whatWeDoPanel2Col2Body ?? ""}
          onCommit={(v) => patch({ whatWeDoPanel2Col2Body: v })}
          rows={4}
        />
      </div>
    </div>
  )
}
