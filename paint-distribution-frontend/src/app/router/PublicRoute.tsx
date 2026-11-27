import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routeConfig";
import { isUserAuthenticated } from "./ProtectedRoute";

interface PublicRouteProps {
  restricted?: boolean;
  children?: React.ReactNode;
}

const PublicRoute = ({ restricted = true, children }: PublicRouteProps) => {
  const authenticated = isUserAuthenticated();

  if (restricted && authenticated) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
