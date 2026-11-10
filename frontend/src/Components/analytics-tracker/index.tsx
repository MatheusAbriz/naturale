import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { identifyUser, initializeAnalytics, resetAnalytics, trackPageView } from "@/lib/analytics";
import { useAuth } from "@/stores/auth-store";

/** Keeps PostHog session identity and SPA pageviews in sync with the app. */
export function AnalyticsTracker() {
  const location = useLocation();
  const user = useAuth((state) => state.user);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const hadIdentifiedSession = useRef(false);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      identifyUser(user);
      hadIdentifiedSession.current = true;
    } else if (hadIdentifiedSession.current) {
      resetAnalytics();
      hadIdentifiedSession.current = false;
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    trackPageView(location.pathname, location.search);
  }, [location.pathname, location.search]);

  return null;
}
