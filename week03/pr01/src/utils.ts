// utils.ts (or similar file)

// 1. Path Management (for Link.tsx)
export const getCurrentPath = (): string => window.location.pathname;

export const navigateTo = (to: string): void => {
  window.history.pushState(null, '', to);
  // Dispatch a custom event to notify components that the path has changed
  window.dispatchEvent(new Event('popstate')); 
  // We use 'popstate' here as a convenient, existing event 
  // that typically fires on history navigation, though a custom event would also work.
};

// 2. Custom Hook (for Router.tsx)
import { useState, useEffect } from 'react';

export const useCurrentPath = (): string => {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(getCurrentPath());
    };

    // Listen to the 'popstate' event which we dispatch in navigateTo 
    // and which also fires when the user uses the browser's back/forward buttons.
    window.addEventListener('popstate', handlePathChange);

    return () => {
      window.removeEventListener('popstate', handlePathChange);
    };
  }, []);

  return currentPath;
};

// 3. Type Guard/Utility (for Router.tsx)
import { isValidElement, type ReactElement } from 'react';
import { Route } from './router/Route';

export const isRouteElement = (element: unknown): element is ReactElement<typeof Route> => {
  return isValidElement(element) && element.type === Route;
};