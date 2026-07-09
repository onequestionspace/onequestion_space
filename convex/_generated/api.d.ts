/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as analytics from "../analytics.js";
import type * as blogs from "../blogs.js";
import type * as chats from "../chats.js";
import type * as earlyAdopters from "../earlyAdopters.js";
import type * as founding from "../founding.js";
import type * as knowledge from "../knowledge.js";
import type * as knowledgeHealth from "../knowledgeHealth.js";
import type * as migrations from "../migrations.js";
import type * as profiles from "../profiles.js";
import type * as questions from "../questions.js";
import type * as reactions from "../reactions.js";
import type * as subscriptions from "../subscriptions.js";
import type * as waitlist from "../waitlist.js";
import type * as whoami from "../whoami.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  analytics: typeof analytics;
  blogs: typeof blogs;
  chats: typeof chats;
  earlyAdopters: typeof earlyAdopters;
  founding: typeof founding;
  knowledge: typeof knowledge;
  knowledgeHealth: typeof knowledgeHealth;
  migrations: typeof migrations;
  profiles: typeof profiles;
  questions: typeof questions;
  reactions: typeof reactions;
  subscriptions: typeof subscriptions;
  waitlist: typeof waitlist;
  whoami: typeof whoami;
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
