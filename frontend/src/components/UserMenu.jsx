import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserMenu() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Failed to read user:", error);
    }

    const email = user?.email || "User";

    // Create initials from email
    const initials = email
        .split("@")[0]
        .slice(0, 2)
        .toUpperCase();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="user-menu">

            {/* User Button */}
            <button
                className="user-menu-button"
                onClick={() => setOpen(!open)}
            >

                <div className="user-avatar">
                    {initials}
                </div>

                <div className="user-info">

                    <span className="user-name">
                        {email.split("@")[0]}
                    </span>

                    <span className="user-email">
                        {email}
                    </span>

                </div>

                <span className="user-arrow">
                    {open ? "↑" : "↓"}
                </span>

            </button>


            {/* Dropdown */}
            {open && (
                <div className="user-dropdown">

                    <div className="dropdown-header">

                        <span className="dropdown-label">
                            ACCOUNT
                        </span>

                        <strong>
                            {email}
                        </strong>

                    </div>


                    <div className="dropdown-divider"></div>


                    <button
                        className="dropdown-item"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <span>⚙</span>
                        Settings
                    </button>


                    <button
                        className="dropdown-item"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <span>?</span>
                        Help
                    </button>


                    <div className="dropdown-divider"></div>


                    <button
                        className="dropdown-logout"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>
            )}

        </div>
    );
}

export default UserMenu;
