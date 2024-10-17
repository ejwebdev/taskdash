import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, googleProvider } from "../../Firebase.jsx";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import googleIcon from "../../assets/google.svg";
import authImg from "../../assets/auth-bg.svg";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Handle Email/Pass Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error logging in:", error);
            alert(error.message);
        }
    };

    // Handle Google Login
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error with Google login:", error);
            alert(error.message);
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
