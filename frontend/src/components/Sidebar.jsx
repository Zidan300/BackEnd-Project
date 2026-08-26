import UserMenu from "./UserMenu";

function Sidebar({ user, onLogout }) {
    return (
        <aside className="sidebar">

            {/* =========================================
                BRAND
            ========================================= */}

            <div className="sidebar-brand">

                <div className="brand-mark">
                    H
                </div>

                <div className="brand-text">

                    <span className="brand-name">
                        HUMANIZE
                    </span>

                    <span className="brand-version">
                        v1.0 / AI TEXT LAB
                    </span>

                </div>

            </div>


            {/* =========================================
                WORKSPACE LABEL
            ========================================= */}

            <div className="workspace-label">

                <span className="status-dot"></span>

                <span className="workspace-title">
                    WORKSPACE
                </span>

                <span className="workspace-line"></span>

            </div>


            {/* =========================================
                MAIN NAVIGATION
            ========================================= */}

            <nav className="sidebar-nav">

                <button
                    type="button"
                    className="nav-item active"
                >

                    <span className="nav-icon">
                        ✦
                    </span>

                    <span className="nav-label">
                        Humanizer
                    </span>

                    <span className="nav-arrow">
                        ↗
                    </span>

                </button>


                <button
                    type="button"
                    className="nav-item"
                >

                    <span className="nav-icon">
                        ◷
                    </span>

                    <span className="nav-label">
                        History
                    </span>

                </button>


                <button
                    type="button"
                    className="nav-item"
                >

                    <span className="nav-icon">
                        □
                    </span>

                    <span className="nav-label">
                        Saved
                    </span>

                </button>

            </nav>


            {/* =========================================
                FLEXIBLE SPACE
                ========================================= */}

            <div className="sidebar-spacer"></div>


            {/* =========================================
                SYSTEM / FOOTER
                ========================================= */}

            <div className="sidebar-footer">

                {/* System label */}

                <div className="workspace-label system-label">

                    <span className="workspace-title">
                        SYSTEM
                    </span>

                    <span className="workspace-line"></span>

                </div>


                {/* Settings */}

                <nav className="sidebar-nav sidebar-system-nav">

                    <button
                        type="button"
                        className="nav-item"
                    >

                        <span className="nav-icon">
                            ⚙
                        </span>

                        <span className="nav-label">
                            Settings
                        </span>

                    </button>

                </nav>


                {/* =====================================
                    ACCOUNT
                    ===================================== */}

                <div className="sidebar-user">

                    <UserMenu
                        user={user}
                        onLogout={onLogout}
                    />

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;
