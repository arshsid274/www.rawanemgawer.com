"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export const useIsTabletOrBelow = () => useMediaQuery("(max-width: 991px)");
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTouchDevice = () => useMediaQuery("(pointer: coarse)");
