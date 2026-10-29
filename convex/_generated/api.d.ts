/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as faq from "../faq.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as leads from "../leads.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_crud from "../lib/crud.js";
import type * as lib_files from "../lib/files.js";
import type * as lib_gallery from "../lib/gallery.js";
import type * as lib_slug from "../lib/slug.js";
import type * as logos from "../logos.js";
import type * as migrations from "../migrations.js";
import type * as model from "../model.js";
import type * as projects from "../projects.js";
import type * as services from "../services.js";
import type * as showcases from "../showcases.js";
import type * as site from "../site.js";
import type * as timeline from "../timeline.js";
import type * as wheel from "../wheel.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  faq: typeof faq;
  files: typeof files;
  http: typeof http;
  leads: typeof leads;
  "lib/auth": typeof lib_auth;
  "lib/crud": typeof lib_crud;
  "lib/files": typeof lib_files;
  "lib/gallery": typeof lib_gallery;
  "lib/slug": typeof lib_slug;
  logos: typeof logos;
  migrations: typeof migrations;
  model: typeof model;
  projects: typeof projects;
  services: typeof services;
  showcases: typeof showcases;
  site: typeof site;
  timeline: typeof timeline;
  wheel: typeof wheel;
}>;

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
>;

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
>;

export declare const components: {};
