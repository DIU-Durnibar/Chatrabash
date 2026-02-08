import { createBrowserRouter} from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import HomePage from "../Home/HomePage";
import HomeLayout from "../MainLayout/HomeLayout";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
  },
  {
    path:"/home",
    Component:HomeLayout
  },
]);

export default Routes