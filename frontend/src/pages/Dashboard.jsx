import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import HumanizerEditor from "../components/HumanizerEditor";
import ResultPanel from "../components/ResultPanel";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =================================
    // HUMANIZER STATE
    // =================================

    const [result, setResult] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [humanizerError, setHumanizerError] = useState("");


    // =================================
    // FETCH PROFILE
    // =================================

    useEffect(() => {

        const fetchProfile = async () => {

            // =================================
            // Check for Google OAuth token
            // =================================

            const params = new URLSearchParams(
                window.location.search
            );

            const googleToken =
                params.get("token");

            if (googleToken) {

                localStorage.setItem(
                    "token",
                    googleToken
                );

                window.history.replaceState(
                    {},
                    document.title,
                    "/dashboard"
                );
            }


            // =================================
            // Get JWT
            // =================================

            const token =
                localStorage.getItem("token");


            // =================================
            // No token
            // =================================

            if (!token) {

                navigate("/login");

                return;
            }


            // =================================
            // Verify JWT
            // =================================

            try {

                const response = await fetch(
                    "http://localhost:4000/api/profile",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


                const data =
                    await response.json();


                // =================================
                // Invalid / expired token
                // =================================

                if (!response.ok) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    navigate("/login");

                    return;
                }


                // =================================
                // Authenticated user
                // =================================

                setUser(data.user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


            } catch (error) {

                console.error(
                    "Profile error:",
                    error
                );

                setError(
                    "Unable to connect to the server."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchProfile();

    }, [navigate]);


    // =================================
    // LOGOUT
    // =================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");
    };


    // =================================
    // HUMANIZER
    // =================================

    const handleHumanize = async (
        text,
        style
    ) => {

        if (!text.trim()) {
            return;
        }


        setIsProcessing(true);

        setHumanizerError("");

        setResult("");


        try {

            // =================================
            // Convert UI style to backend mode
            // =================================

            const styleMap = {

                Natural: "natural",

                Balanced: "natural",

                Academic: "academic",

                Casual: "casual",

            };


            const mode =
                styleMap[style] || "natural";


            // =================================
            // Call Humanizer API
            // =================================

            const response = await fetch(
                "http://localhost:4000/api/humanize",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({

                        text,

                        mode,

                    }),
                }
            );


            const data =
                await response.json();


            // =================================
            // API ERROR
            // =================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Humanization failed."
                );
            }


            // =================================
            // SAVE RESULT
            // =================================

            setResult(
                data.humanized || ""
            );


        } catch (error) {

            console.error(
                "Humanizer error:",
                error
            );

            setHumanizerError(
                error.message ||
                "Unable to humanize text."
            );


        } finally {

            setIsProcessing(false);

        }

    };


    // =================================
    // LOADING
    // =================================

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="loading-mark">
                    H
                </div>

                <p>
                    Loading workspace...
                </p>

            </div>

        );
    }


    // =================================
    // ERROR
    // =================================

    if (error) {

        return (

            <div className="dashboard-error">

                <div className="error-card">

                    <span className="error-label">
                        CONNECTION ERROR
                    </span>

                    <h1>
                        Something went wrong
                    </h1>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Back to Login
                    </button>

                </div>

            </div>

        );
    }


    // =================================
    // DASHBOARD
    // =================================

    return (

        <div className="dashboard">

            <Sidebar
                user={user}
                onLogout={handleLogout}
            />


            <main className="dashboard-main">


                {/* =================================
                    DASHBOARD HEADER
                ================================= */}

                <div className="dashboard-header">

                    <div>

                        <span className="dashboard-kicker">
                            HUMANIZER WORKSPACE
                        </span>

                        <h1>
                            Make it sound human.
                        </h1>

                        <p>
                            Rewrite AI-generated text into
                            something that feels natural.
                        </p>

                    </div>

                </div>


                {/* =================================
                    HUMANIZER WORKSPACE
                ================================= */}

                <section className="humanizer-workspace">


                    <HumanizerEditor
                        onHumanize={handleHumanize}
                        isProcessing={isProcessing}
                    />


                    <ResultPanel
                        result={result}
                        error={humanizerError}
                    />


                </section>


            </main>

        </div>

    );
}

export default Dashboard;
