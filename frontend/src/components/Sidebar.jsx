import UserMenu from "./UserMenu";

function Sidebar({ user, onLogout }) {
    return (
        <aside className="sidebar">

            {/* Brand */}
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


            {/* Workspace indicator */}
            <div className="workspace-label">
                <span className="status-dot"></span>

                <span>
                    WORKSPACE
                </span>

                <span className="workspace-line"></span>
            </div>


            {/* Navigation */}
            <nav className="sidebar-nav">

                <button className="nav-item active">
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


                <button className="nav-item">
                    <span className="nav-icon">
                        ◷
                    </span>

                    <span className="nav-label">
                        History
                    </span>
                </button>


                <button className="nav-item">
                    <span className="nav-icon">
                        □
                    </span>

                    <span className="nav-label">
                        Saved
                    </span>
                </button>

            </nav>


            {/* Lower navigation */}
            <div className="sidebar-bottom">

                <div className="workspace-label">
                    <span>
                        SYSTEM
                    </span>

                    <span className="workspace-line"></span>
                </div>


                <nav className="sidebar-nav">

                    <button className="nav-item">
                        <span className="nav-icon">
                            ⚙
                        </span>

                        <span className="nav-label">
                            Settings
                        </span>
                    </button>

                </nav>

            </div>


            {/* User */}
            <div className="sidebar-user">

                <UserMenu
                    user={user}
                    onLogout={onLogout}
                />

            </div>

        </aside>
    );
}

export default Sidebar;
