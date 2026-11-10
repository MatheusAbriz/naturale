import posthog from "posthog-js";
import type { User } from "@/types/auth";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

const apiKey = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";
let initialized = false;

/**
 * Product analytics deliberately never receives form values, recipe bodies,
 * chat messages, e-mail addresses, phone numbers, CPF, tokens or payment URLs.
 */
export function initializeAnalytics() {
  if (initialized || !apiKey) return;

  posthog.init(apiKey, {
    api_host: apiHost,
    capture_pageview: false,
    autocapture: false,
    disable_session_recording: true,
    person_profiles: "identified_only",
  });
  initialized = true;
}

export function track(event: string, properties: AnalyticsProperties = {}) {
  if (!initialized) return;
  posthog.capture(event, properties);
}

export function identifyUser(user: User) {
  if (!initialized) return;

  posthog.identify(`user_${user.id}`, {
    role: user.role,
  });
}

export function resetAnalytics() {
  if (!initialized) return;
  posthog.reset();
}

export function trackPageView(pathname: string, search: string) {
  track("$pageview", {
    $current_url: `${window.location.origin}${pathname}`,
    path: pathname,
    has_query_parameters: Boolean(search),
  });
}
