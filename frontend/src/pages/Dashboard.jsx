import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {

            const token = localStorage.getItem("token");

            // No token
            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await fetch(
                    "http://localhost:4000/api/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                // Token invalid or expired
                if (!response.ok) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                    return;
                }

                // Store authenticated user
                setUser(data.user);

            } catch (error) {

                console.error("Profile error:", error);

                setError("Unable to connect to the server.");

            } finally {

                setLoading(false);

            }
        };

        fetchProfile();

    }, [navigate]);


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };


    // ===============================
    // Loading
    // ===============================

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }


    // ===============================
    // Error
    // ===============================

    if (error) {
        return (
            <div>
                <h1>Something went wrong</h1>

                <p>{error}</p>

                <button onClick={() => navigate("/login")}>
                    Back to Login
                </button>
            </div>
        );
    }


    // ===============================
    // Dashboard
    // ===============================

    return (
        <div>

            <h1>Dashboard</h1>

            <p>
                Welcome back, {user?.email}
            </p>

            <p>
                You are successfully authenticated.
            </p>

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;
