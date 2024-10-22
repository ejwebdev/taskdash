import "./todo.css";

const todo = [
    {
        title: "Update Intern Progress",
        desc: "I need to update regularly about my internship status.",
    },
];

function Todo() {
    return (
        <section className="todo">
            <div className="todo-cntnr">
                <h2>To Do Tasks</h2>
                <p>
                    This section displays all your to do tasks and their
                    description.
                </p>
                <div className="todo-grid">
                    {todo.map((todo, index) => (
                        <div key={index}>
                            <p>TODOS</p>
                            <p>
                                <span className="material-symbols-rounded text-blue-700">
                                    circle
                                </span>
                                {todo.title}
                            </p>
                            <p>{todo.desc}</p>
                            <div>
                                <button>
                                    <span className="material-symbols-rounded">
                                        edit_square
                                    </span>
                                    Edit
                                </button>
                                <button>
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
        </section>
    );
}

export default Todo;
