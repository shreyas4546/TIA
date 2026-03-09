
/**
 * Throttles a function to only execute once per animation frame.
 * Useful for high-frequency events like scroll or mousemove.
 */
export function throttleOnAnimationFrame<T extends (...args: any[]) => void>(fn: T): T {
  let ticking = false;

  return ((...args: any[]) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
      ticking = true;
    }
  }) as T;
}

/**
 * Hook to attach a throttled event listener
 */
export function attachThrottledEvent(
  element: HTMLElement | Window,
  event: string,
  handler: (...args: any[]) => void
) {
  const throttledHandler = throttleOnAnimationFrame(handler);
  element.addEventListener(event, throttledHandler);
  return () => element.removeEventListener(event, throttledHandler);
}
