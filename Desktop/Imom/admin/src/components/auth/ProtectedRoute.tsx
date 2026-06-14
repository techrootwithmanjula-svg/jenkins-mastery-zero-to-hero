import { Navigate, Outlet, useLocation } from "react-router";
import { tokenManager } from "../../utils/tokenManager";
import { userManager } from "../../utils/userManager";
import { UserRole } from "../../types/entities";

export default function ProtectedRoute() {
  const location = useLocation();

  if (!tokenManager.isLoggedIn()) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  const user = userManager.getUser();
  if (!user || user.role !== UserRole.ADMIN) {
    tokenManager.clearToken();
    userManager.clearUser();
    return <Navigate to="/signin" state={{ from: location, adminOnly: true }} replace />;
  }

  return <Outlet />;
}
