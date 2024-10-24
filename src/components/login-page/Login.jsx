import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, googleProvider, db } from "../../Firebase.jsx";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import googleIcon from "../../assets/google.svg";
import authImg from "../../assets/auth-bg.svg";
import "./login.css";

function Login() {
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

    // Handle Email/Pass Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error logging in:", error);
            showNotification("Error logging in.", "error");
        }
    };

    // Handle Google Login
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if the user is registered
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                showNotification("Please sign up before logging in.", "error");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error with Google login:", error);
            showNotification("Error with Google login.", "error");
        }
    };

    return (
        <section className="login">
            <div className="login-cntnr">
                <form onSubmit={handleLogin}>
                    <h2>Begin Here</h2>
                    <p>Start managing your task now.</p>
                    <button type="button" onClick={handleGoogleSignIn}>
                        <img src={googleIcon} alt="Google Icon" />
                        Continue with Google
                    </button>
                    <p>Or</p>
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
                        Don&apos;t have an account?{" "}
                        <Link to="/signup">Sign Up</Link>
                    </p>
                    <button type="submit">Login</button>
                    {notification.message && (
                        <p className={`notification ${notification.type}`}>
                            {notification.message}
                        </p>
                    )}
                </form>
                <div>
                    <img src={authImg} alt="Login Image" draggable="false" />
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

export default Login;
