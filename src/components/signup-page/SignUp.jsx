import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db, googleProvider } from "../../Firebase.jsx";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import googleIcon from "../../assets/google.svg";
import authImg from "../../assets/auth-bg.svg";
import "./signup.css";

function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ message: "", type: "" });

    // Notification Message
    const showNotification = (message, type) => {
        setNotification({ message, type });

        setTimeout(() => {
            setNotification({ message: "", type: "" });
        }, 3000);
    };

    // Handle Email/Pass Sign Up
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            // Store user information
            await setDoc(doc(db, "users", user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
            });

            navigate("/");
        } catch (error) {
            console.error("Error signing up:", error);
            showNotification("Error signing up.", "error");
        }
    };

    // Handle Google Sign Up
    const handleGoogleSignUp = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;

            await setDoc(
                doc(db, "users", user.uid),
                {
                    firstName: user.displayName.split(" ")[0],
                    lastName: user.displayName.split(" ")[1],
                    email: user.email,
                },
                { merge: true }
            );

            navigate("/");
        } catch (error) {
            console.error("Error signing in with Google:", error);
            showNotification("Error signing in with Google.", "error");
        }
    };

    return (
        <section className="signup">
            <div className="signup-cntnr">
                <form onSubmit={handleSignUp}>
                    <h2>Get Started</h2>
                    <p>Create your account now.</p>
                    <button type="button" onClick={handleGoogleSignUp}>
                        <img src={googleIcon} alt="Google Icon" />
                        Sign Up with Google
                    </button>
                    <p>Or</p>
                    <div>
                        <input
                            type="text"
                            autoComplete="off"
                            placeholder="First Name"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            type="text"
                            autoComplete="off"
                            placeholder="Last Name"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <input
                        type="email"
                        autoComplete="off"
                        placeholder="Email Address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        autoComplete="off"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p>
                        Already have an account? <Link to="/">Login</Link>
                    </p>
                    <button type="submit">Sign Up</button>
                    {notification.message && (
                        <p className={`notification ${notification.type}`}>
                            {notification.message}
                        </p>
                    )}
                </form>
                <div>
                    <img src={authImg} alt="Sign Up Image" draggable="false" />
                    <div>
                        <h2>TaskDash</h2>
                        <p>
                            A real-time task manager app designed for effortless
                            task creation, seamless editing, and quick deletion.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignUp;
