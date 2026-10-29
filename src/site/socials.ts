import type { Site } from "../../convex/model"

/** Profile links from stored handles; empty handles are skipped. */
export const socials = ({ instagram, tiktok, linkedin, youtube }: Site["contact"]) =>
  [
    { label: "Instagram", handle: instagram, href: `https://www.instagram.com/${instagram}/` },
    { label: "TikTok", handle: tiktok, href: `https://www.tiktok.com/@${tiktok}` },
    { label: "LinkedIn", handle: linkedin, href: linkedin },
    { label: "YouTube", handle: youtube, href: `https://www.youtube.com/@${youtube}` },
  ].filter((social) => social.handle)
