import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    // =========================================
    // Check for Google OAuth token
    // =========================================

    const params = new URLSearchParams(
        window.location.search
    );

    const googleToken =
        params.get("token");


    // =========================================
    // Google OAuth callback
    // =========================================

    if (googleToken) {

        // Save Google JWT
        localStorage.setItem(
            "token",
            googleToken
        );

        // Remove token from URL
        window.history.replaceState(
            {},
            document.title,
            "/dashboard"
        );

        // Allow Dashboard to render
        return children;
    }


    // =========================================
    // Normal authentication
    // =========================================

    const token =
        localStorage.getItem("token");


    // =========================================
    // No token
    // =========================================

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // =========================================
    // Authenticated user
    // =========================================

    return children;
}

export default ProtectedRoute;
