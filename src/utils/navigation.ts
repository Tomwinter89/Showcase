import type { NavigateFunction } from 'react-router-dom';

/** Runs `callback` inside a View Transition when the browser supports it — the
 *  root crossfade defined in globals.css applies automatically. Falls back to
 *  calling it directly otherwise. Reused for route changes and in-place
 *  content swaps (e.g. switching a feature-page demo variant). */
export function withViewTransition(callback: () => void) {
  if ('startViewTransition' in document) {
    (document as Document & { startViewTransition: (cb: () => void) => void })
      .startViewTransition(callback);
  } else {
    callback();
  }
}

export function navigateWithTransition(navigate: NavigateFunction, to: string | number) {
  withViewTransition(() => navigate(to as string));
}
