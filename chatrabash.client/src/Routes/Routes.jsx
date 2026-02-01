import { createBrowserRouter} from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import HomePage from "../Home/HomePage";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
  },
  {
    path:"/home",
    Component:HomePage
  }
]);

export default Routes