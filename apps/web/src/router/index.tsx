import { createBrowserRouter } from 'react-router-dom'
import Landingpage from "../pages/Landingpage";
import TeacherDashboard from "../pages/teacherUI/dashboard";
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landingpage />,
  },
  {
    path: '/teacher',
    element: <TeacherDashboard />,
  },
]);