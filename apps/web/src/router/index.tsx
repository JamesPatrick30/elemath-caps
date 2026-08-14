import { createBrowserRouter } from "react-router-dom";

import Landingpage from "../pages/Landingpage";
import TeacherDashboard from "../pages/teacherUI/Dashboard";
import TeacherLogin from "../pages/auth/TeacherLogin";
import ClassesPage from "../pages/teacherUI/Classes";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import QuizLobby from "../pages/teacherUI/QuizLobby";
import StudentLogin from "../pages/auth/StudentLogin";
import StudentDashboardPage from "../pages/studentUI/dashboardPage";
import StudentQuizLobby from "../pages/studentUI/quizLobby";
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
            {
                path: "/student/login",
                element: <StudentLogin />,
            },
        ],
    },

    // Teacher routes
    {
        element: <ProtectedRoute allowedRole="teacher" />,
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
                element: <QuizLobby />,
            }
        ],
    },

    // Student routes
    {
        element: <ProtectedRoute allowedRole="student" />,
        children: [
            {
                path: "/student",
                element: <StudentDashboardPage />,
            },
            {
                path: "/student/quiz-lobby",
                element: <StudentQuizLobby />,
            },
        ],
    },
]);