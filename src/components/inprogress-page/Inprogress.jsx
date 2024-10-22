import "./inprogress.css";

const inprogress = [
    {
        title: "Learn Music Theory",
        desc: "I wanna learn music theory to improve my skills in playing musical instruments.",
    },
    {
        title: "Practice React Hooks",
        desc: "I want to improve my knowledge and exposure in using react hooks.",
    },
];

function Inprogress() {
    return (
        <section className="inprogress">
            <div className="inprogress-cntnr">
                <h2>In Progress Tasks</h2>
                <p>
                    This section displays all your in progress tasks and their
                    description.
                </p>
                <div className="inprogress-grid">
                    {inprogress.map((inprogress, index) => (
                        <div key={index}>
                            <p>IN PROGRESS</p>
                            <p>
                                <span className="material-symbols-rounded text-yellow-500">
                                    circle
                                </span>
                                {inprogress.title}
                            </p>
                            <p>{inprogress.desc}</p>
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

export default Inprogress;
