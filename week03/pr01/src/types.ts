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

export interface RoutesProps {
  children: ReactNode;
}