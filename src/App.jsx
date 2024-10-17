import { Routes, Route } from "react-router-dom";
import Login from "./components/login-page/Login.jsx";
import SignUp from "./components/signup-page/SignUp.jsx";
import Dashboard from "./pages/DashboardPage.jsx";
import ToDo from "./pages/TodoPage.jsx";
import InProgress from "./pages/InprogressPage.jsx";
import Completed from "./pages/CompletedPage.jsx";

function App() {
    return (
        <>
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
