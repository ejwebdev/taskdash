import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "./components/login-section/Login.jsx";
import SignUp from "./components/signup-section/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ToDo from "./pages/Todo.jsx";
import InProgress from "./pages/Inprogress.jsx";
import Completed from "./pages/Completed.jsx";

function App() {
    // Scroll to Top when route changes
    const ScrollToTop = () => {
        const { pathname } = useLocation();

        useEffect(() => {
            window.scrollTo(0, 0);
        }, [pathname]);

        return null;
    };

    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/todo" element={<ToDo />} />
                <Route path="/inprogress" element={<InProgress />} />
                <Route path="/completed" element={<Completed />} />
            </Routes>
        </>
    );
}

export default App;
