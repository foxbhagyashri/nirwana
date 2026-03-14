import { useEffect, useRef, useState } from "react";

/**
 * useOnScreen - reveals `visible=true` once the element enters the viewport.
 * It stays true after first intersection (good for deferring fetch/animations).
 */
export function useOnScreen<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return { ref, visible };
}
