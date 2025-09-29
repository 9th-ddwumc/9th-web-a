// types.ts

import type { ReactNode, ComponentType } from 'react';

// For Link.tsx
export interface LinkProps {
  to: string;
  children: ReactNode;
}

// For Route.tsx
export interface RouteProps {
  path?: string; // Optional path property to satisfy the Route element's props
  component: ComponentType<unknown>;
}

// For Router.tsx
export interface RoutesProps {
  children: ReactNode;
}