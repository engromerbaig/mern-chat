import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const Login = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");  // Added email state
    const [password, setPassword] = useState("");

    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure either username or email is provided
        if (!username && !email) {
            return toast.error("Please provide either a username or email.");
        }
        if (!password) {
            return toast.error("Please provide a password.");
        }
        await login(username, email, password);
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
                            <span className='text-base label-text'>Username (optional)</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter username'
                            className='w-full input input-bordered h-10'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text'>Email (optional)</span>
                        </label>
                        <input
                            type='email'
                            placeholder='Enter email'
                            className='w-full input input-bordered h-10'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                {loading ? <span className='loading loading-spinner '></span> : "Login"}
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
