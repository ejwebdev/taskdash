import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase.jsx";
import "./sidebar.css";

function Sidebar() {
    // Log out authenticated user
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Error logging out. Please try again.");
        }
    };

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <span className="material-symbols-rounded">
                                dashboard
                            </span>
                            <p>Dashboard</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/todo"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <span className="material-symbols-rounded">
                                pending_actions
                            </span>
                            <p>To Do</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/inprogress"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <span className="material-symbols-rounded">
                                clock_loader_20
                            </span>
                            <p>In Progress</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/completed"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <span className="material-symbols-rounded">
                                task_alt
                            </span>
                            <p>Completed</p>
                        </NavLink>
                    </li>
                </ul>
                <button onClick={handleLogout}>
                    <span className="material-symbols-rounded">logout</span>
                    Log out
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;
