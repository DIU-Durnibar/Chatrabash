import { createBrowserRouter} from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import HomeLayout from "../MainLayout/HomeLayout";
import SignIn from "../Components/SignIn";
import StudentDashboard from "../Dashboards/StudentDashboard";
import SignUp from "../Components/SignUp";
import AvailableHostels from "../Pages/AvailableHostels";
import HomePage from "../Home/HomePage";
import Staff from "../Components/Staff";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
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
        path: "staff", 
        Component: Staff
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
  },
]);

export default Routes