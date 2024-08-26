import { BiLogOut } from "react-icons/bi";
import { useNavigate, useLocation } from 'react-router-dom';
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout, role } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDashboardRedirect = () => {
    navigate('/admin-dashboard'); // Adjust the path as necessary
  };

  // Determine if we are on the /admin-dashboard page
  const isOnDashboard = location.pathname === '/admin-dashboard';

  return (
    <div className='mt-auto flex gap-6 items-center'>
		          <BiLogOut className='w-6 h-6 text-white cursor-pointer' onClick={logout} />

      {!loading ? (
        <>
          {/* Show the Return to Dashboard button only if the user is a Super Admin and not on the dashboard page */}
          {role === 'Super Admin' && !isOnDashboard && (
            <button
              onClick={handleDashboardRedirect}
              className='text-white text-sm bg-blue-500 px-2 py-0  hover:bg-blue-600 transition duration-300 mr-4'
            >
              Return to Dashboard
            </button>
          )}
        </>
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </div>
  );
};

export default LogoutButton;
