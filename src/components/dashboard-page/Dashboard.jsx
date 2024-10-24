import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../../Firebase.jsx";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    updateDoc,
    doc,
} from "firebase/firestore";
import userProfile from "../../assets/user-profile.svg";
import "./dashboard.css";

function Dashboard() {
    // Variables to hold task counts
    const [totalTaskCount, setTotalTaskCount] = useState(0);
    const [todoCount, setTodoCount] = useState(0);
    const [inProgressCount, setInProgressCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    // Variables
    const [isModalOpen, setModalOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskStatus, setTaskStatus] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [dashTask, setDashTask] = useState([]);
    const [dashUsers, setDashUsers] = useState([]);
    const [draggedTask, setDraggedTask] = useState(null);

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        setTaskTitle("");
        setTaskStatus("");
        setTaskDescription("");
    };

    // Task count
    const topGrid = [
        {
            title: "TOTAL TASK",
            value: totalTaskCount,
            span: {
                class: "bg-violet-600",
                name: "format_list_bulleted",
            },
            link: "#dash-task",
            status: "Total",
        },
        {
            title: "TODOS",
            value: todoCount,
            span: {
                class: "bg-blue-700",
                name: "pending_actions",
            },
            link: "/todo",
            status: "To Do",
        },
        {
            title: "IN PROGRESS",
            value: inProgressCount,
            span: {
                class: "bg-yellow-500",
                name: "clock_loader_20",
            },
            link: "/inprogress",
            status: "In Progress",
        },
        {
            title: "COMPLETED",
            value: completedCount,
            span: {
                class: "bg-green-600",
                name: "task_alt",
            },
            link: "/completed",
            status: "Completed",
        },
    ];

    // Handle modal submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            console.error("No user found please reload.");
            return;
        }

        try {
            await addDoc(collection(db, "tasks"), {
                userId: currentUser.uid,
                title: taskTitle,
                status: taskStatus,
                description: taskDescription,
                createdAt: new Date(),
            });
            console.log("Task Submitted:", {
                title: taskTitle,
                status: taskStatus,
                description: taskDescription,
            });

            closeModal();
        } catch (error) {
            console.error("Error adding task: ", error);
        }
    };

    // Fetch current user's tasks
    const fetchUserTasks = useCallback(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, "tasks"),
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasks = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setDashTask(tasks);

            // Count tasks by status
            setTotalTaskCount(tasks.length);
            setTodoCount(
                tasks.filter((task) => task.status === "To Do").length
            );
            setInProgressCount(
                tasks.filter((task) => task.status === "In Progress").length
            );
            setCompletedCount(
                tasks.filter((task) => task.status === "Completed").length
            );
        });

        return unsubscribe;
    }, [currentUser]);

    // Fetch other users
    const fetchOtherUsers = useCallback(() => {
        if (!currentUser) return;
        const unsubscribe = onSnapshot(
            collection(db, "users"),
            (usersSnapshot) => {
                const usersData = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Filter out the current user immediately
                const filteredUsers = usersData.filter(
                    (user) => user.id !== currentUser.uid
                );

                const userTasksMap = {};

                const usersWithRecentTasks = filteredUsers.map((user) => {
                    const tasksQuery = query(
                        collection(db, "tasks"),
                        where("userId", "==", user.id),
                        orderBy("createdAt", "desc"),
                        limit(1)
                    );

                    const unsubscribeTasks = onSnapshot(
                        tasksQuery,
                        (tasksSnapshot) => {
                            const userRecentTask = tasksSnapshot.docs.length
                                ? tasksSnapshot.docs[0].data().title
                                : "No tasks available";

                            // Update the userTasksMap
                            userTasksMap[user.id] = {
                                name: `${user.firstName} ${user.lastName}`,
                                title: userRecentTask,
                                id: user.id,
                            };

                            // Update the dashUsers state after processing all users
                            setDashUsers(Object.values(userTasksMap));
                        }
                    );

                    return {
                        user,
                        unsubscribeTasks,
                    };
                });

                return () =>
                    usersWithRecentTasks.forEach(({ unsubscribeTasks }) =>
                        unsubscribeTasks()
                    );
            }
        );

        return unsubscribe;
    }, [currentUser]);

    // Determine the title color based on task status
    const getStatusClass = (status) => {
        switch (status) {
            case "To Do":
                return "text-blue-700";
            case "In Progress":
                return "text-yellow-500";
            case "Completed":
                return "text-green-600";
            default:
                return "";
        }
    };

    // Handle Drag & Drop
    const handleDragStart = (task) => {
        setDraggedTask(task);
    };

    const handleDrop = async (gridStatus) => {
        if (
            gridStatus === "Total" ||
            !draggedTask ||
            draggedTask.status === gridStatus
        )
            return;

        try {
            const taskDocRef = doc(db, "tasks", draggedTask.id);
            await updateDoc(taskDocRef, {
                status: gridStatus,
            });
            setDraggedTask(null);
        } catch (error) {
            console.error("Error updating task status: ", error);
        }
    };

    const allowDrop = (e) => {
        e.preventDefault();
    };

    // Smooth Auto Scroll when task dragged
    useEffect(() => {
        let scrolling = false;

        const handleDragOver = (event) => {
            const { clientY } = event;

            // Scroll up
            if (clientY < 70 && !scrolling) {
                scrolling = true;
                window.requestAnimationFrame(() => {
                    window.scrollBy({
                        top: -500,
                        behavior: "smooth",
                    });
                    scrolling = false;
                });
            }

            // Scroll down
            if (clientY > window.innerHeight - 70 && !scrolling) {
                scrolling = true;
                window.requestAnimationFrame(() => {
                    window.scrollBy({
                        top: 500,
                        behavior: "smooth",
                    });
                    scrolling = false;
                });
            }
        };

        window.addEventListener("dragover", handleDragOver);

        return () => {
            window.removeEventListener("dragover", handleDragOver);
        };
    }, []);

    // Monitor authentication state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
                fetchUserTasks();
            } else {
                setCurrentUser(null);
            }
        });

        fetchOtherUsers();

        return () => unsubscribe();
    }, [fetchUserTasks, fetchOtherUsers]);

    return (
        <section className="dashboard">
            <div className="dashboard-cntnr">
                <div className="dashboard-top-grid">
                    {topGrid.map((topGrid, index) => (
                        <div
                            key={index}
                            onDragOver={allowDrop}
                            onDrop={() => handleDrop(topGrid.status)}
                        >
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
                        statuses in real time.
                    </p>
                    <p>
                        <strong>Note:</strong> Drag to the top to change the
                        status quickly.
                    </p>
                    <button onClick={openModal}>
                        <span className="material-symbols-rounded">add</span>
                        Create Task
                    </button>
                    <div id="dash-task">
                        <table>
                            <thead>
                                <tr>
                                    <th>Task Title</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashTask.map((task, indexTask) => (
                                    <tr
                                        key={indexTask}
                                        draggable="true"
                                        onDragStart={() =>
                                            handleDragStart(task)
                                        }
                                        title="Drag to the top to change the status"
                                    >
                                        <td>
                                            <p>
                                                <span
                                                    className={`material-symbols-rounded ${getStatusClass(
                                                        task.status
                                                    )}`}
                                                >
                                                    circle
                                                </span>
                                                {task.title}
                                            </p>
                                        </td>
                                        <td>
                                            <p>{task.status}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h2>Other Users Tasks</h2>
                    <p>
                        Explore tasks assigned to other users and track their
                        progress efficiently.
                    </p>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Recent Task</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashUsers.map((users, indexUser) => (
                                    <tr key={indexUser}>
                                        <td>
                                            <p>
                                                <img
                                                    src={userProfile}
                                                    alt="User Profile"
                                                    draggable="false"
                                                />
                                                {users.name}
                                            </p>
                                        </td>
                                        <td>
                                            <p>
                                                <span className="material-symbols-rounded text-blue-700">
                                                    new_releases
                                                </span>
                                                {users.title}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add New Task</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Title:
                                <input
                                    type="text"
                                    placeholder="Task Title"
                                    autoComplete="off"
                                    value={taskTitle}
                                    onChange={(e) =>
                                        setTaskTitle(e.target.value)
                                    }
                                    required
                                />
                            </label>
                            <label>
                                Status:
                                <select
                                    value={taskStatus}
                                    onChange={(e) =>
                                        setTaskStatus(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">
                                        In Progress
                                    </option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <span className="material-symbols-rounded">
                                    unfold_more
                                </span>
                            </label>
                            <label>
                                Description:
                                <textarea
                                    placeholder="Write Your Message Here"
                                    value={taskDescription}
                                    onChange={(e) =>
                                        setTaskDescription(e.target.value)
                                    }
                                    required
                                />
                            </label>
                            <div>
                                <button type="button" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Dashboard;
