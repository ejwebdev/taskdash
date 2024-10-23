import { useState, useEffect, useCallback } from "react";
import { db, auth } from "../../Firebase.jsx";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import "./todo.css";

function Todo() {
    const [todoTasks, setTodoTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskStatus, setTaskStatus] = useState("");
    const [taskDescription, setTaskDescription] = useState("");

    // Fetch To Do tasks for the current user
    const fetchTodoTasks = useCallback(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "tasks"),
            where("userId", "==", currentUser.uid),
            where("status", "==", "To Do"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasks = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setTodoTasks(tasks);
        });

        return unsubscribe;
    }, [currentUser]);

    // Monitor authentication state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
                fetchTodoTasks();
            } else {
                setCurrentUser(null);
            }
        });

        // Cleanup on unmount
        return () => unsubscribe();
    }, [fetchTodoTasks]);

    // Handle edit
    const handleEditClick = (task) => {
        setTaskToEdit(task);
        setTaskTitle(task.title);
        setTaskStatus(task.status);
        setTaskDescription(task.description);
        setShowEditModal(true);
    };

    // Close edit modal
    const closeEditModal = () => {
        setShowEditModal(false);
        setTaskToEdit(null);
    };

    // Submit edited task
    const submitEditTask = async (e) => {
        e.preventDefault();

        if (taskToEdit) {
            try {
                await updateDoc(doc(db, "tasks", taskToEdit.id), {
                    title: taskTitle,
                    status: taskStatus,
                    description: taskDescription,
                });
                setShowEditModal(false);
            } catch (error) {
                console.error("Error updating task: ", error);
            }
        }
    };

    // Handle delete
    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setShowModal(true);
    };

    // Confirm delete
    const confirmDeleteTask = async () => {
        if (taskToDelete) {
            try {
                await deleteDoc(doc(db, "tasks", taskToDelete.id));
                setTodoTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== taskToDelete.id)
                );
                setShowModal(false);
            } catch (error) {
                console.error("Error deleting task: ", error);
            }
        }
    };

    // Cancel deletion
    const cancelDelete = () => {
        setShowModal(false);
        setTaskToDelete(null);
    };

    return (
        <section className="todo">
            <div className="todo-cntnr">
                <h2>To Do Tasks</h2>
                <p>
                    This section displays all your to do tasks and their
                    description.
                </p>
                <div className="todo-grid">
                    {todoTasks.map((task, index) => (
                        <div key={index}>
                            <p>TODOS</p>
                            <p>
                                <span className="material-symbols-rounded text-blue-700">
                                    circle
                                </span>
                                {task.title}
                            </p>
                            <p>{task.description}</p>
                            <div>
                                <button onClick={() => handleEditClick(task)}>
                                    <span className="material-symbols-rounded">
                                        edit_square
                                    </span>
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteClick(task)}>
                                    <span className="material-symbols-rounded">
                                        delete
                                    </span>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Edit Task</h3>
                        <form onSubmit={submitEditTask}>
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
                                    placeholder="Task Description"
                                    value={taskDescription}
                                    onChange={(e) =>
                                        setTaskDescription(e.target.value)
                                    }
                                    required
                                />
                            </label>
                            <div>
                                <button type="button" onClick={closeEditModal}>
                                    Cancel
                                </button>
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this task?</p>
                        <div>
                            <button onClick={cancelDelete}>Cancel</button>
                            <button onClick={confirmDeleteTask}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Todo;
