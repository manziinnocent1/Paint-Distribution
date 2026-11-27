import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES, type AppRole } from "./routeConfig";

interface StoredUser {
  id?: string;
  email?: string;
  role?: AppRole;
  is_active?: boolean;
}

interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
  children?: React.ReactNode;
}

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";

export const getStoredAccessToken = (): string | null => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const getStoredUser = (): StoredUser | null => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as StoredUser;
  } catch {
    return null;
  }
};

export const isUserAuthenticated = (): boolean => {
  return Boolean(getStoredAccessToken());
};

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const location = useLocation();

  const authenticated = isUserAuthenticated();

  if (!authenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  const user = getStoredUser();

  if (user?.is_active === false) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!user?.role || !allowedRoles.includes(user.role)) {
      return <Navigate to={ROUTES.dashboard} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
