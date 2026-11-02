/* POST /refresh?key=ADMIN_KEY: fetch now and report ok / the error per platform */
import { getEnv, isAdmin } from "../lib/util.js";
import { refreshAll } from "../lib/stats.js";

export default async request => {
  const env = getEnv();
  if (!isAdmin(new URL(request.url), env)) return new Response("Forbidden", { status: 403 });
  return Response.json(await refreshAll(env));
};

export const config = { path: "/refresh", method: "POST" };
