/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts up (production only).
 *
 * PURPOSE: Keeps Render.com free-tier server alive by self-pinging the
 * /api/health endpoint every 10 minutes, preventing it from sleeping
 * due to inactivity.
 *
 * Render.com free tier spins down after ~15 minutes of no traffic.
 * This self-ping fires every 10 min, keeping the instance warm.
 */

export async function register() {
  // Only run the keep-alive loop in the Node.js runtime (server), not edge
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // Only activate in production (no noise in local dev)
  if (process.env.NODE_ENV !== "production") return;

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_URL ||
    "https://festival-de-ingles.onrender.com";

  const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
  const PING_URL = `${baseUrl}/api/health`;

  console.log(`[Keep-Alive] 🔥 Server keep-alive started. Pinging ${PING_URL} every 10 min.`);

  // Initial ping after 30 seconds (let the server finish booting)
  setTimeout(async () => {
    await ping(PING_URL);
  }, 30_000);

  // Recurring ping every 10 minutes
  setInterval(async () => {
    await ping(PING_URL);
  }, PING_INTERVAL_MS);
}

async function ping(url: string) {
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    console.log(`[Keep-Alive] ✅ Ping OK — ${url} responded with ${res.status}`);
  } catch (err) {
    console.warn(`[Keep-Alive] ⚠️ Ping failed — ${url}:`, err);
  }
}
