/**
 * Cloudflare Worker: proxy e-unify.ai/pmis/* to the PMIS app on Vercel.
 *
 * Setup:
 * 1. After importing the repo on Vercel, copy your production URL
 *    (e.g. https://pmis-rbriehl.vercel.app) and set ORIGIN below.
 * 2. Cloudflare dashboard -> Workers & Pages -> Create Worker ->
 *    paste this file -> Deploy.
 * 3. On the worker: Settings -> Domains & Routes -> Add route:
 *      Route:  e-unify.ai/pmis*
 *      Zone:   e-unify.ai
 *    (The e-unify.ai DNS record must be proxied — orange cloud — which
 *    it already is if Cloudflare fronts your Railway site.)
 *
 * The app is built with basePath=/pmis, so paths pass through unchanged:
 *   e-unify.ai/pmis/dashboard -> <ORIGIN>/pmis/dashboard
 */

const ORIGIN = "https://pmis-silk.vercel.app";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const origin = new URL(ORIGIN);

    // Same path and query, different host
    url.hostname = origin.hostname;
    url.protocol = origin.protocol;
    url.port = "";

    const proxied = new Request(url, request);
    // Vercel routes by Host header
    proxied.headers.set("Host", origin.hostname);

    const response = await fetch(proxied);

    // Rewrite any absolute redirects back to e-unify.ai
    const location = response.headers.get("Location");
    if (location && location.startsWith(ORIGIN)) {
      const fixed = new Headers(response.headers);
      fixed.set("Location", location.replace(ORIGIN, "https://e-unify.ai"));
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: fixed,
      });
    }
    return response;
  },
};
