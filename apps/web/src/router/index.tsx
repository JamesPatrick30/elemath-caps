import { createBrowserRouter } from "react-router-dom";

import Landingpage from "../pages/Landingpage";
import TeacherDashboard from "../pages/teacherUI/Dashboard";
import TeacherLogin from "../pages/auth/TeacherLogin";
import ClassesPage from "../pages/teacherUI/Classes";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import QuizLobby from "../pages/teacherUI/QuizLobby";
export const router = createBrowserRouter([
    {
        element: <GuestRoute />,
        children: [
            {
                path: "/",
                element: <Landingpage />,
            },
            {
                path: "/teacher/login",
                element: <TeacherLogin />,
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/teacher",
                element: <TeacherDashboard />,
            },
            {
                path: "/teacher/classes",
                element: <ClassesPage />,
            },
            {
                path: "/teacher/quiz-lobby/:classId",
                element: <QuizLobby/>,
            }
        ],
    },
]);