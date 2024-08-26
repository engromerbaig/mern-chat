import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import PendingApproval from "./pages/pendingApproval/PendingApproval";

function App() {
  const { authUser } = useAuthContext();


  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path="/pending-approval" element={<PendingApproval />} />

        <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
        <Route
          path='/admin-dashboard'
          element={authUser && authUser.role === 'Super Admin' ? <AdminDashboard /> : <Navigate to='/' />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
