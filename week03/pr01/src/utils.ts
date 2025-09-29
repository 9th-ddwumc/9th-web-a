import { isValidElement, type ReactElement, type ReactNode } from 'react';

export const getCurrentPath = (): string => window.location.pathname;

export const navigateTo = (to: string): void => {
  window.history.pushState(null, '', to);
  window.dispatchEvent(new Event('popstate')); 
};

import { useState, useEffect } from 'react';
import type { RouteProps } from './types';

export const useCurrentPath = (): string => {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(getCurrentPath());
    };

    window.addEventListener('popstate', handlePathChange);

    return () => {
      window.removeEventListener('popstate', handlePathChange);
    };
  }, []);

  return currentPath;
};

// export const isRouteElement = (element: unknown): element is ReactElement<typeof Route> => {
//   return isValidElement(element) && element.type === Route;
// };
export const isRouteElement = (
  child: ReactNode
): child is ReactElement<RouteProps> => {
  return isValidElement(child);
};
// ReactElement<RouteProps>로 변경 -> React 엘리먼트의 props가 RouteProps 타입임을 명시
// 그래서 이제 TS가 route.props에 path나 component속성이 있다는 것을 인식