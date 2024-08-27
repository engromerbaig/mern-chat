import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate();  // Initialize useNavigate

    const signup = async ({ fullName, username, email, password, confirmPassword, gender, role }) => {
        const success = handleInputErrors({ fullName, username, email, password, confirmPassword, gender, role });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, username, email, password, confirmPassword, gender, role }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            localStorage.setItem("chat-user", JSON.stringify(data));
            setAuthUser(data);

            // Redirect to a different screen after successful signup
            navigate("/pending-approval");  // Adjust the path as needed

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

function handleInputErrors({ fullName, username, email, password, confirmPassword, gender, role }) {
    if (!fullName || !username || !email || !password || !confirmPassword || !gender || !role) {
        toast.error("Please fill in all fields");
        return false;
    }

    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    // More comprehensive email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        toast.error("Invalid email address");
        return false;
    }

    // Validate role
    const validRoles = [
        "Manager", "Agent", "R&D Role", "R&D Admin Role", "FE Role",
        "Staff Access Control Role", "Closer Role", "Team Lead Role",
        "RNA Specialist Role", "CB Specialist Role", "Decline Specialist Role"
    ];

    if (!validRoles.includes(role)) {
        toast.error("Invalid role selected");
        return false;
    }

    return true;
}

export default useSignup;
