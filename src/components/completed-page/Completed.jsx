import "./completed.css";

const completed = [
    {
        title: "Practice Communication Skills",
        desc: "I will practice on how to speak fluently to enhance my communication to others.",
    },
];

function Completed() {
    return (
        <section className="completed">
            <div className="completed-cntnr">
                <h2>Completed Tasks</h2>
                <p>
                    This section displays all your completed tasks and their
                    description.
                </p>
                <div className="completed-grid">
                    {completed.map((completed, index) => (
                        <div key={index}>
                            <p>COMPLETED</p>
                            <p>
                                <span className="material-symbols-rounded text-green-600">
                                    circle
                                </span>
                                {completed.title}
                            </p>
                            <p>{completed.desc}</p>
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

export default Completed;
