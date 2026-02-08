import { createBrowserRouter} from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import HomePage from "../Home/HomePage";
import HomeLayout from "../MainLayout/HomeLayout";
import SignIn from "../Components/SignIn";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
  },
  {
    path:"/home",
    Component:HomeLayout
  },
  {
    path:"/signIn",
    Component:SignIn
  },
]);

export default Routes