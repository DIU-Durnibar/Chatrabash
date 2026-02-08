import { createBrowserRouter} from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import HomeLayout from "../MainLayout/HomeLayout";
import SignIn from "../Components/SignIn";
import StudentDashboard from "../Dashboards/StudentDashboard";

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
        
      }
    ]
  },
  {
    path:"/signIn",
    Component:SignIn
  },
  {
   path:"/home/studentDashboard",
        Component:StudentDashboard
  },
]);

export default Routes