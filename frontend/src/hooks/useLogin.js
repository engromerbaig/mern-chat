import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate(); // Get navigate function from react-router-dom

    const login = async (username, email, password) => {
        const success = handleInputErrors(username, email, password);
        if (!success) return;
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }), // Send username and email separately
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            const loginTime = new Date().toISOString();
            const userData = { ...data, role: data.role, loginTime };

            localStorage.setItem("chat-user", JSON.stringify(userData));
            setAuthUser(userData);

            // Redirect based on role
            if (userData.role === "Super Admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/");
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;

function handleInputErrors(username, email, password) {
    if (!username && !email) {
        toast.error("Please provide either a username or email.");
        return false;
    }
    if (!password) {
        toast.error("Please provide a password.");
        return false;
    }

    return true;
}
