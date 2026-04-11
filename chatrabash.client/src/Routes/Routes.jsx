import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import PublicChromeLayout from "../layouts/PublicChromeLayout";
import AppShellLayout from "../layouts/AppShellLayout";
import ProtectedRoute from "./ProtectedRoute";
import HomeIndex from "./HomeIndex";
import SignIn from "../Components/SignIn";
import SignUp from "../Components/SignUp";
import HostelExplorePage from "../Pages/HostelExplorePage";
import HostelDetailPage from "../Pages/HostelDetailPage";
import PendingUsers from "../Manager's End/Pages/PendingUsers";
import AllHostel from "../Manager's End/Pages/AllHostel";
import CreateRoom from "../Manager's End/Pages/CreateRoom";
import HostelRooms from "../Manager's End/Pages/HostelRooms";
import UpdateRoom from "../Manager's End/Pages/UpdateRoom";
import ManagerBillingPage from "../Pages/dashboard/ManagerBillingPage";
import BoarderOverviewPage from "../Pages/dashboard/BoarderOverviewPage";
import BoarderBillsPage from "../Pages/dashboard/BoarderBillsPage";
import PlaceholderPage from "../Pages/PlaceholderPage";
import HostelRegisterPage from "../Pages/HostelRegisterPage";
import AdminDashboardPage from "../Pages/admin/AdminDashboardPage";
import AdminHostelsPage from "../Pages/admin/AdminHostelsPage";
import AdminLogsPage from "../Pages/admin/AdminLogsPage";
import AdminManagerPaymentsPage from "../Pages/admin/AdminManagerPaymentsPage";
import AdminSettingsPage from "../Pages/admin/AdminSettingsPage";
import ManagerLogsPage from "../Pages/dashboard/ManagerLogsPage";
import ManagerBoardersPage from "../Pages/dashboard/ManagerBoardersPage";
import ManagerSettingsPage from "../Pages/dashboard/ManagerSettingsPage";
import BoarderSettingsPage from "../Pages/dashboard/BoarderSettingsPage";

const Routes = createBrowserRouter([
  { path: "/", element: <MainLayout /> },
  { path: "/signIn", Component: SignIn },
  { path: "/signUp", Component: SignUp },
  { path: "/register-hostel", Component: HostelRegisterPage },
  {
    path: "/explore",
    element: <PublicChromeLayout />,
    children: [{ index: true, Component: HostelExplorePage }],
  },
  {
    path: "/hostels/:id",
    element: <PublicChromeLayout />,
    children: [{ index: true, Component: HostelDetailPage }],
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: HomeIndex },
      { path: "availablehostels", element: <Navigate to="/explore" replace /> },
      { path: "Pending-users", Component: PendingUsers },
      { path: "all-hostels", Component: AllHostel },
      { path: "create-room", Component: CreateRoom },
      { path: "rooms", Component: HostelRooms },
      { path: "update-rooms/:id", Component: UpdateRoom },
      { path: "boarders", Component: ManagerBoardersPage },
      { path: "billing", Component: ManagerBillingPage },
      { path: "manager-logs", Component: ManagerLogsPage },
      { path: "manager-settings", Component: ManagerSettingsPage },
      { path: "admin", Component: AdminDashboardPage },
      { path: "admin/hostels", Component: AdminHostelsPage },
      { path: "admin/logs", Component: AdminLogsPage },
      { path: "admin/manager-payments", Component: AdminManagerPaymentsPage },
      { path: "admin/settings", Component: AdminSettingsPage },
      { path: "boarder", Component: BoarderOverviewPage },
      { path: "boarder/bills", Component: BoarderBillsPage },
      {
        path: "boarder/complaints",
        element: <PlaceholderPage title="অভিযোগ বক্স" hint="টিকিটিং সিস্টেম API সংযোগের পর এখানে দেখাবে।" />,
      },
      { path: "boarder/settings", Component: BoarderSettingsPage },
      { path: "studentDashboard", element: <Navigate to="/home/boarder" replace /> },
      { path: "roommanagement", element: <Navigate to="/home/rooms" replace /> },
    ],
  },
]);

export default Routes;
