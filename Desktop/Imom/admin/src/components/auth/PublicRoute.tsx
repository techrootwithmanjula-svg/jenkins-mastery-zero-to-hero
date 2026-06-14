import { Navigate, Outlet } from "react-router";
import { tokenManager } from "../../utils/tokenManager";

export default function PublicRoute() {
  if (tokenManager.isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
