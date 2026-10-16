import { useEffect, useRef } from "react";

// Hook simples de infinite scroll pra web: observa um elemento sentinela
// no fim da lista e dispara `onReachEnd` quando ele entra na viewport.
export function useInfiniteScrollSentinel(onReachEnd: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onReachEnd();
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onReachEnd, enabled]);

  return sentinelRef;
}
