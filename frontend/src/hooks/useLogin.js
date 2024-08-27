import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate();

    const login = async (usernameOrEmail, password) => {
        // Validate input
        const success = handleInputErrors(usernameOrEmail, password);
        if (!success) return;

        setLoading(true);
        try {
            // Prepare request body with either username or email
            const requestBody = {
                password,
                ...(usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail })
            };

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
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

function handleInputErrors(usernameOrEmail, password) {
    if (!usernameOrEmail) {
        toast.error("Please provide a username or email.");
        return false;
    }
    if (!password) {
        toast.error("Please provide a password.");
        return false;
    }

    return true;
}
