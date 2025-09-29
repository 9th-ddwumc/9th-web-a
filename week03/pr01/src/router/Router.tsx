import { Children, cloneElement, useMemo, type FC } from "react";
import type { RoutesProps } from "../types";
import { isRouteElement, useCurrentPath } from "../utils";

// Router.tsx
export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();
  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};