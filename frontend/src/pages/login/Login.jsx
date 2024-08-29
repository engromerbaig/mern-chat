import { useState } from "react";
import toast from "react-hot-toast";
import useLogin from "../../hooks/useLogin";
import { Link } from "react-router-dom";

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState(""); // Single field for username or email
    const [password, setPassword] = useState("");

    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usernameOrEmail) {
            toast.error("Please provide a username or email.");
            return;
        }
        if (!password) {
            toast.error("Please provide a password.");
            return;
        }

        // Call login with usernameOrEmail and password
        await login(usernameOrEmail, password);
    };

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-2xl bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
                <h1 className='text-3xl font-semibold text-center text-gray-300'>
                    Corporate
                    <span className='text-blue-500'> ChatApp</span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text'>Username or Email</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter username or email'
                            className='w-full input input-bordered h-10'
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            className='w-full input input-bordered h-10'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="py-4">
                        <div>
                            <button className='btn w-1/2 flex justify-center mx-auto btn-sm mt-4' disabled={loading}>
                                {loading ? <span className='loading loading-spinner'></span> : "Login"}
                            </button>
                        </div>

                        <Link to='/signup'>
                            <button
                                className='btn w-1/2 flex justify-center mx-auto bg-blue-600 border-none text-white btn-sm mt-4 hover:bg-blue-700'
                                disabled={loading}
                            >
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
