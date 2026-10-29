import { Link as RouterLink, type LinkProps } from "react-router"

/** Site link: every navigation runs the column-wipe view transition. */
export const Link = (props: LinkProps) => <RouterLink viewTransition {...props} />
