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
            const response = await fetch("http://localhost:4000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/dashboard");

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server.");
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="background-glow glow-one"></div>
            <div className="background-glow glow-two"></div>

            <div className="login-card">

                <div className="login-header">

                    <div className="logo">
                        L
                    </div>

                    <h1>Welcome back</h1>

                    <p>
                        Sign in to continue to your account
                    </p>

                </div>

                <form onSubmit={handleLogin}>

                    <div className="input-group">

                        <label htmlFor="email">
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>

                    <div className="input-group">

                        <div className="password-label">

                            <label htmlFor="password">
                                Password
                            </label>

                            <button
                                type="button"
                                className="show-password"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>

                        </div>

                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                    </div>

                    {message && (
                        <div className="login-message">
                            {message}
                        </div>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

                <div className="divider">
                    <span>New here?</span>
                </div>

                <button
                    className="register-button"
                    onClick={() => navigate("/register")}
                >
                    Create an account
                </button>

                <p className="security-note">
                    Your connection is secured with encrypted authentication.
                </p>

            </div>

        </div>
    );
}

export default Login;
