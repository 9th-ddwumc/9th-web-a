// types.ts

import type { ReactNode, ComponentType } from 'react';

export interface LinkProps {
  to: string;
  children: ReactNode;
}

export interface RouteProps {
//   path?: string; 
//   component: ComponentType<unknown>;
    path: string;
    component: ComponentType<unknown>;
}

// For Router.tsx
export interface RoutesProps {
  children: ReactNode;
}