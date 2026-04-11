import { Navigate } from "react-router-dom";
import { getRolesFromStorage } from "../lib/auth";
import ManagerDashboardPage from "../Pages/dashboard/ManagerDashboardPage";
import BoarderOverviewPage from "../Pages/dashboard/BoarderOverviewPage";
export default function HomeIndex() {
  const roles = getRolesFromStorage();
  if (roles.includes("SuperAdmin")) return <Navigate to="/home/admin" replace />;
  if (roles.includes("Boarder")) return <BoarderOverviewPage />;
  if (roles.includes("Manager")) return <ManagerDashboardPage />;
  return <Navigate to="/signIn" replace />;
}
