import { createBrowserRouter } from 'react-router-dom'
import Landingpage from "../pages/Landingpage";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landingpage />,
  },
]);