/* Refreshes the stats every 3 hours (scheduled functions are included in the free plan) */
import { getEnv } from "../lib/util.js";
import { refreshAll } from "../lib/stats.js";

export default async () => {
  console.log(JSON.stringify(await refreshAll(getEnv())));
};

export const config = { schedule: "0 */3 * * *" };
