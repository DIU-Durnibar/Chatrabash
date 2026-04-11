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
import Help from "../Home/LandingPage/Help";
import HostelRegistration from "../Saas Features/HostelRegistration";
import AdminDashboard from "../Saas Features/Manager/AdminDashboard";
import AdminLayout from "../Saas Features/Manager/AdminLayout";

const Routes = createBrowserRouter([



  // for public access
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
    Component: Help
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
    path:"/hostel-registration",
    Component:HostelRegistration
  },
    ]
  },




  // for logged in User
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
   path:"/home/studentDashboard",
        Component:StudentDashboard
  },
  
]);

export default Routes