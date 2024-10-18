import { Link } from "react-router-dom";
import userProfile from "../../assets/user-profile.svg";
import "./dashboard.css";

// I added default values temporarily
const topGrid = [
    {
        title: "TOTAL TASK",
        value: "10",
        span: {
            class: "bg-violet-600",
            name: "format_list_bulleted",
        },
        link: "#dash-task",
    },
    {
        title: "TODOS",
        value: "1",
        span: {
            class: "bg-blue-700",
            name: "pending_actions",
        },
        link: "/todo",
    },
    {
        title: "IN PROGRESS",
        value: "3",
        span: {
            class: "bg-yellow-500",
            name: "clock_loader_20",
        },
        link: "/inprogress",
    },
    {
        title: "COMPLETED",
        value: "6",
        span: {
            class: "bg-green-600",
            name: "task_alt",
        },
        link: "/completed",
    },
];

const dashTask = [
    {
        title: {
            class: "text-blue-700",
            task: "Update Intern Progress",
        },
        status: "To Do",
    },
    {
        title: {
            class: "text-yellow-500",
            task: "Practice React Hooks",
        },
        status: "In Progress",
    },
    {
        title: {
            class: "text-green-600",
            task: "Practice Communication Skills",
        },
        status: "Completed",
    },
];

const dashUser = [
    {
        name: "Noel Santos",
        title: {
            class: "text-blue-700",
            task: "Coaching my client",
        },
    },
    {
        name: "Ralph Perez",
        title: {
            class: "text-blue-700",
            task: "Practice new programming skill",
        },
    },
];

function Dashboard() {
    return (
        <section className="dashboard">
            <div className="dashboard-cntnr">
                <div className="dashboard-top-grid">
                    {topGrid.map((topGrid, index) => (
                        <div key={index}>
                            <p>{topGrid.title}</p>
                            <div>
                                <h3>{topGrid.value}</h3>
                                <span
                                    className={`material-symbols-rounded ${topGrid.span.class}`}
                                >
                                    {topGrid.span.name}
                                </span>
                            </div>
                            <Link to={topGrid.link}>View Task</Link>
                        </div>
                    ))}
                </div>
                <div className="dashboard-bottom">
                    <h2>Task Overview</h2>
                    <p>
                        This section displays all your tasks and their current
                        statuses.
                    </p>
                    <div id="dash-task">
                        <table>
                            <tr>
                                <th>Task Title</th>
                                <th>Status</th>
                            </tr>
                            {dashTask.map((dashTask, indexTask) => (
                                <tr key={indexTask}>
                                    <td>
                                        <p>
                                            <span
                                                className={`material-symbols-rounded ${dashTask.title.class}`}
                                            >
                                                circle
                                            </span>
                                            {dashTask.title.task}
                                        </p>
                                    </td>
                                    <td>
                                        <p>{dashTask.status}</p>
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                    <h2>Other Users Tasks</h2>
                    <p>
                        Explore tasks assigned to other users and track their
                        progress efficiently.
                    </p>
                    <div>
                        <table>
                            <tr>
                                <th>Full Name</th>
                                <th>Recent Task</th>
                            </tr>
                            {dashUser.map((dashUser, indexUser) => (
                                <tr key={indexUser}>
                                    <td>
                                        <p>
                                            <img
                                                src={userProfile}
                                                alt="User Profile"
                                                draggable="false"
                                            />
                                            {dashUser.name}
                                        </p>
                                    </td>
                                    <td>
                                        <p>
                                            <span
                                                className={`material-symbols-rounded ${dashUser.title.class}`}
                                            >
                                                circle
                                            </span>
                                            {dashUser.title.task}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
