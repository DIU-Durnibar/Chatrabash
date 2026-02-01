import { createBrowserRouter} from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
  },
]);

export default Routes