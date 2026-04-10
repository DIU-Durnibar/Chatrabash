import { createBrowserRouter} from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import HomeLayout from "../MainLayout/HomeLayout";
import SignIn from "../Components/SignIn";
import StudentDashboard from "../Dashboards/StudentDashboard";
import SignUp from "../Components/SignUp";
import AvailableHostels from "../Pages/AvailableHostels";
import HomePage from "../Home/HomePage";
import PendingUsers from "../Manager's End/Pages/PendingUsers";
import AllHostel from "../Manager's End/Pages/AllHostel";
import CreateRoom from "../Manager's End/Pages/CreateRoom";
import HostelRooms from "../Manager's End/Pages/HostelRooms";
import UpdateRoom from "../Manager's End/Pages/UpdateRoom";
import HostelKhujun from "../Home/LandingPage/HostelKhujun";
import kivabeKajKore from "../Home/LandingPage/kivabeKajKore";
import LandingPage from "../Home/LandingPage";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children:[
    {
    index:true,
    Component:LandingPage,
    },
    {
    path:"availablehostels",
    Component: HostelKhujun
    },
    {
    path:"how-it-works",
    Component: kivabeKajKore
    },
    {
    path:"help",
    Component: kivabeKajKore
    },
    ]
  },
  {
    path:"/home",
    Component:HomeLayout,
    children:[
      {
        index: true,
        Component: HomePage
      },
      {
        path: "availablehostels", 
        Component: AvailableHostels
      },
      {
        path: "Pending-users", 
        Component: PendingUsers
      },
      {
        path: "all-hostels", 
        Component: AllHostel
      },
      {
        path: "create-room", 
        Component: CreateRoom
      },
      {
        path: "rooms", 
        Component: HostelRooms
      },
      {
        path: "update-rooms/:id",
        Component: UpdateRoom
      },
    ]
  },
  {
    path:"/signIn",
    Component:SignIn
  },
  {
    path:"/signUp",
    Component:SignUp
  },
  {
   path:"/home/studentDashboard",
        Component:StudentDashboard
  }
]);

export default Routes