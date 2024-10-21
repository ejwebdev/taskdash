import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase.jsx";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import logo from "../../assets/logo.svg";
import userProfile from "../../assets/user-profile.svg";
import "./header.css";

function Header() {
    const refreshPage = () => {
        window.location.reload();
    };

    // Get authenticated user name
    const [fullName, setFullName] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setFullName(
                            `${userData.firstName} ${userData.lastName}`
                        );
                    } else {
                        console.log("User document does not exist.");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setFullName("Loading..."); // If no user is logged in
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        if (window.innerWidth < 1000) {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

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
        <header className="header">
            <div className="header-cntnr">
                <h3 onClick={refreshPage}>
                    <img src={logo} alt="TaskDash Logo" draggable="false" />
                    TaskDash
                </h3>
                <div>
                    <p>{fullName || "Loading..."}</p>
                    <img
                        src={userProfile}
                        title={fullName || "Loading..."}
                        alt="User Profile"
                        draggable="false"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown();
                        }}
                    />
                    <ul
                        className={`dropdown ${
                            isDropdownOpen ? "open" : "hidden"
                        }`}
                    >
                        <li>
                            <p>
                                <span className="material-symbols-rounded">
                                    person
                                </span>
                                {fullName || "Loading..."}
                            </p>
                        </li>
                        <li>
                            <p onClick={handleLogout}>
                                <span className="material-symbols-rounded">
                                    logout
                                </span>
                                Log out
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default Header;
