import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Matches from "./pages/Matches";
import Requests from "./pages/Requests";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {

    const location = useLocation();

    const publicPages = [
        "/login",
        "/register"
    ];

    const showNavbar =
        !publicPages.includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar />}

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/matches"
                    element={
                        <ProtectedRoute>
                            <Matches />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/requests"
                    element={
                        <ProtectedRoute>
                            <Requests />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;