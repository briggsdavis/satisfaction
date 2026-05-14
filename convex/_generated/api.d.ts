/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server"
import type * as about from "../about.js"
import type * as contact from "../contact.js"
import type * as files from "../files.js"
import type * as footer from "../footer.js"
import type * as homepage from "../homepage.js"
import type * as logos from "../logos.js"
import type * as portfolio from "../portfolio.js"
import type * as seed from "../seed.js"
import type * as services from "../services.js"

declare const fullApi: ApiFromModules<{
  about: typeof about
  contact: typeof contact
  files: typeof files
  footer: typeof footer
  homepage: typeof homepage
  logos: typeof logos
  portfolio: typeof portfolio
  seed: typeof seed
  services: typeof services
}>

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>

export declare const components: {}
