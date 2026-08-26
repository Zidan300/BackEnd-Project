import { useState } from "react";

function UserMenu({ user, onLogout }) {
    const [open, setOpen] = useState(false);

    const email = user?.email || "user@example.com";

    // Get a clean username from the email
    const username =
        user?.username ||
        email.split("@")[0] ||
        "User";

    // Avatar initials
    const initials = username
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="user-menu">

            {/* Profile button */}
            <button
                type="button"
                className={`user-trigger ${open ? "is-open" : ""}`}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >

                {/* Avatar */}
                <div className="user-avatar">
                    {initials}
                </div>


                {/* User information */}
                <div className="user-info">

                    <span className="user-name">
                        {username}
                    </span>

                    <span className="user-email">
                        {email}
                    </span>

                </div>


                {/* Arrow */}
                <span
                    className={`user-chevron ${
                        open ? "rotate" : ""
                    }`}
                >
                    ↓
                </span>

            </button>


            {/* Dropdown */}
            {open && (
                <div className="user-dropdown">

                    <div className="user-dropdown-header">

                        <span className="dropdown-label">
                            ACCOUNT
                        </span>

                        <span className="dropdown-user">
                            {email}
                        </span>

                    </div>


                    <button
                        type="button"
                        className="dropdown-action"
                        onClick={() => setOpen(false)}
                    >
                        Profile
                    </button>


                    <button
                        type="button"
                        className="dropdown-action logout"
                        onClick={onLogout}
                    >
                        Sign out
                    </button>

                </div>
            )}

        </div>
    );
}

export default UserMenu;
