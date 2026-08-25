import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    ArrowRight,
} from "lucide-react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
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
                setMessage(data.message || "Invalid email or password");
                setLoading(false);
                return;
            }

            // Save JWT
            localStorage.setItem("token", data.token);

            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);
            setMessage("Unable to connect to the server.");
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* Background image */}
            <div className="login-background"></div>

            {/* Soft overlay */}
            <div className="login-overlay"></div>

            {/* Login Card */}
            <main className="login-card">

                {/* Login Icon */}
                <div className="login-icon">
                    <LogIn size={22} strokeWidth={2} />
                </div>

                {/* Header */}
                <div className="login-header">

                    <h1>Sign in with email</h1>

                    <p>
                        Make a new doc to bring your words,
                        data, and teams together. For free.
                    </p>

                </div>

                {/* Form */}
                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    {/* Email */}
                    <div className="input-wrapper">

                        <Mail
                            className="input-icon"
                            size={19}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* Password */}
                    <div className="input-wrapper">

                        <Lock
                            className="input-icon"
                            size={19}
                        />

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={19} />
                            ) : (
                                <Eye size={19} />
                            )}
                        </button>

                    </div>

                    {/* Forgot password */}
                    <div className="forgot-password">

                        <button
                            type="button"
                            onClick={() => {
                                setMessage(
                                    "Password reset is not available yet."
                                );
                            }}
                        >
                            Forgot password?
                        </button>

                    </div>

                    {/* Error message */}
                    {message && (
                        <div className="login-message">
                            {message}
                        </div>
                    )}

                    {/* Login button */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            "Signing in..."
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                </form>

                {/* Divider */}
                <div className="divider">
                    <span>Or sign in with</span>
                </div>

                {/* Social login */}
                <div className="social-login">

                  <button
                      type="button"
                      className="social-button"
                      onClick={() => {
                          window.location.href =
                              "http://localhost:4000/auth/google";
                      }}
                  >
                      G
                  </button>

                    <button
                        type="button"
                        className="social-button facebook"
                        title="Facebook"
                    >
                        <span>f</span>
                    </button>

                    <button
                        type="button"
                        className="social-button apple"
                        title="Apple"
                    >
                        <span>●</span>
                    </button>

                </div>

                {/* Register */}
                <div className="register-section">

                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create one
                    </button>

                </div>

            </main>

        </div>
    );
}

export default Login;
