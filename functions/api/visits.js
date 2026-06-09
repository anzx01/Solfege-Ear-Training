const TOTAL_KEY = "site:visits:total";
const LEGACY_TOTAL_KEY = "site:visits";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getShanghaiDateKey(now = new Date()) {
  return new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function getDailyKey(dateKey) {
  return `site:visits:daily:${dateKey}`;
}

function parseCount(rawCount) {
  const parsedCount = Number.parseInt(rawCount ?? "0", 10);
  return Number.isFinite(parsedCount) && parsedCount >= 0 ? parsedCount : 0;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
}

async function handleVisitRequest(env, shouldIncrement) {
  if (!env.VISIT_COUNTER) {
    return json({ error: "VISIT_COUNTER binding is not configured." }, 501);
  }

  const date = getShanghaiDateKey();
  const dailyKey = getDailyKey(date);
  const [rawTotalCount, rawLegacyTotalCount, rawTodayCount] = await Promise.all([
    env.VISIT_COUNTER.get(TOTAL_KEY),
    env.VISIT_COUNTER.get(LEGACY_TOTAL_KEY),
    env.VISIT_COUNTER.get(dailyKey)
  ]);

  const currentTotalCount = parseCount(rawTotalCount ?? rawLegacyTotalCount);
  const currentTodayCount = parseCount(rawTodayCount);
  const total = shouldIncrement ? currentTotalCount + 1 : currentTotalCount;
  const today = shouldIncrement ? currentTodayCount + 1 : currentTodayCount;

  if (shouldIncrement) {
    await Promise.all([
      env.VISIT_COUNTER.put(TOTAL_KEY, String(total)),
      env.VISIT_COUNTER.put(dailyKey, String(today), { expirationTtl: 90 * DAY_IN_MS })
    ]);
  }

  return json({ today, total, date });
}

export async function onRequestGet({ env }) {
  return handleVisitRequest(env, false);
}

export async function onRequestPost({ env }) {
  return handleVisitRequest(env, true);
}
