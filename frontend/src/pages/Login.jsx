import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    // =================================
    // Normal Login
    // =================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");

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

                setMessage(
                    data.message || "Login failed"
                );

                return;
            }

            // Save JWT
            localStorage.setItem(
                "token",
                data.token
            );

            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to connect to server."
            );

        }
    };


    // =================================
    // Google Login
    // =================================

    const handleGoogleLogin = () => {

        window.location.href =
            "http://localhost:4000/auth/google";

    };


    return (

        <div className="login-page">

            <div className="login-box">

                {/* =========================
                    Title
                ========================= */}

                <h1>Login</h1>


                {/* =========================
                    Login Form
                ========================= */}

                <form onSubmit={handleLogin}>

                    {/* Username / Email */}

                    <input
                        type="email"
                        placeholder="Username"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />


                    {/* Password */}

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


                    {/* Show Password */}

                    <label className="show-password">

                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        />

                        <span>
                            Show password
                        </span>

                    </label>


                    {/* Login Button */}

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>

                </form>


                {/* Error / Status */}

                {message && (
                    <p className="login-message">
                        {message}
                    </p>
                )}


                {/* =========================
                    Google Login
                ========================= */}

                <button
                    type="button"
                    className="google-button"
                    onClick={handleGoogleLogin}
                >

                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#4285F4"
                            d="M21.35 12.27c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
                        />

                        <path
                            fill="#34A853"
                            d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.6z"
                        />

                        <path
                            fill="#FBBC05"
                            d="M6.54 13.69A5.85 5.85 0 0 1 6.23 12c0-.59.11-1.16.31-1.69V7.78H3.29A9.77 9.77 0 0 0 2.25 12c0 1.58.38 3.08 1.04 4.22l3.25-2.53z"
                        />

                        <path
                            fill="#EA4335"
                            d="M12 6.28c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.71 5.38l3.25 2.53C7.31 8 9.46 6.28 12 6.28z"
                        />
                    </svg>

                    Login with Google

                </button>


                {/* =========================
                    Register
                ========================= */}

                <p className="register-text">

                    Don't have an account?

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create one
                    </button>

                </p>

            </div>

        </div>

    );
}

export default Login;
