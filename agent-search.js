await page.goto("https://www.google.com/search?q=AI+software+engineering+internships+India+2026", { waitUntil: "domcontentloaded" });

const RESULT_LINK_TIMEOUT_MS = 12000;
let resultsAppeared = false;

try {
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll("a")).some(a => (a.getAttribute("href") || "").includes("/goto?url=")),
    { timeout: RESULT_LINK_TIMEOUT_MS }
  );
  resultsAppeared = true;
} catch (e) {
  const pollStart = Date.now();
  while (Date.now() - pollStart < RESULT_LINK_TIMEOUT_MS) {
    const found = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a")).some(a => (a.getAttribute("href") || "").includes("/goto?url="))
    );
    if (found) {
      resultsAppeared = true;
      break;
    }
    await page.waitForTimeout(500);
  }
}

const results = await page.evaluate(() => {
  // Google internal nav/chrome we never want as a "result": settings, account,
  // maps, images, other Google properties, and pure-fragment anchors.
  const GOOGLE_INTERNAL_HOST_RE = /(^|\.)google\.[a-z.]+$/i;
  const GOOGLE_INTERNAL_PATH_RE = /^\/(search|preferences|advanced_search|imgres|maps|setprefs|url\?)/i;

  function isGoogleInternalNav(rawHref, absolute) {
    if (!absolute) return true;
    if (GOOGLE_INTERNAL_HOST_RE.test(absolute.hostname) && !rawHref.startsWith("/goto?url=")) return true;
    if (GOOGLE_INTERNAL_PATH_RE.test(absolute.pathname)) return true;
    return false;
  }

  function toAbsolute(rawHref) {
    try {
      return new URL(rawHref, location.href);
    } catch (e) {
      return null;
    }
  }

  // Try to decode a real destination out of /goto?url=<token>. Google's token
  // here is often not a plain URL (it can be an opaque encoded blob), so this
  // is best-effort: if decoding fails or doesn't look like a URL, we fall
  // back to keeping the raw /goto?url=... href instead of dropping the result.
  function tryDecodeGotoDestination(absolute) {
    const wrapped = absolute.searchParams.get("url") || absolute.searchParams.get("q");
    if (!wrapped) return null;

    const attempts = [wrapped, decodeURIComponent(wrapped)];
    for (const candidate of attempts) {
      try {
        const parsed = new URL(candidate);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          return parsed.href;
        }
      } catch (e) {
        // not a real URL, try next attempt or give up
      }
    }
    return null;
  }

  const anchors = Array.from(document.querySelectorAll("a"));

  return anchors
    .map(a => {
      const rawHref = a.getAttribute("href") || "";
      const text = (a.innerText || "").trim();
      const absolute = toAbsolute(rawHref);

      if (!absolute || isGoogleInternalNav(rawHref, absolute)) {
        return null;
      }

      let href = null;
      let hrefType = "";

      if (rawHref.startsWith("/goto?url=") || absolute.pathname === "/goto") {
        const decoded = tryDecodeGotoDestination(absolute);
        if (decoded) {
          href = decoded;
          hrefType = "decoded";
        } else {
          href = absolute.href; // keep the raw /goto?url=... link rather than discarding the result
          hrefType = "raw_goto";
        }
      } else if (absolute.protocol === "http:" || absolute.protocol === "https:") {
        href = absolute.href;
        hrefType = "direct";
      }

      if (!href || text.length <= 15) return null;

      return { text, href, hrefType };
    })
    .filter(Boolean);
});

const seen = new Set();
const candidates = [];
for (const r of results) {
  if (seen.has(r.href)) continue;
  seen.add(r.href);
  candidates.push(r);
  if (candidates.length >= 10) break;
}

return { ok: true, query: page.url(), resultsAppeared, candidates };