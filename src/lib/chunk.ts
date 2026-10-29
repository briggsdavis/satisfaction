/**
 * Walks a repeating layout template, slicing `items` into groups sized by
 * each step: chunk([a..f], ["one","two"], {one:1,two:2}) -> one[a], two[b,c], one[d], two[e,f].
 */
export const chunk = <T, K extends string>(
  items: readonly T[],
  template: readonly K[],
  sizes: Record<K, number>,
) => {
  const groups: { kind: K; items: T[]; index: number }[] = []
  for (let i = 0, t = 0; i < items.length; t++) {
    const kind = template[t % template.length]
    groups.push({ kind, items: items.slice(i, i + sizes[kind]), index: t })
    i += sizes[kind]
  }
  return groups
}
