import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:4000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                setLoading(false);
                return;
            }

            // Save JWT
            localStorage.setItem("token", data.token);

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server.");
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* Background */}
            <div className="login-background" />

            {/* Dark overlay */}
            <div className="login-overlay" />

            {/* Login Card */}
            <div className="login-card">

                {/* Left side */}
                <div className="login-intro">

                    <div className="logo">
                        L
                    </div>

                    <h1>
                        Welcome back.
                    </h1>

                    <p>
                        Sign in to continue to your account.
                    </p>

                </div>

                {/* Right side */}
                <div className="login-form-section">

                    <form onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="input-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>

                        {/* Password */}
                        <div className="input-group">

                            <div className="password-header">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="show-password"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        {/* Error */}
                        {message && (
                            <div className="login-message">
                                {message}
                            </div>
                        )}

                        {/* Login */}
                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>

                    </form>

                    {/* Register */}
                    <div className="register-area">

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            className="register-link"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create one
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;
