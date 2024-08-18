// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// console.log("AdminDashboard.jsx");
// const AdminDashboard = () => {
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPendingRequests = async () => {
//       try {
//         const response = await axios.get('/api/admin/pending-requests');
//         setPendingRequests(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load pending requests');
//         setLoading(false);
//       }
//     };

//     fetchPendingRequests();
//   }, []);

//   const handleApprove = async (userId) => {
//     try {
//       await axios.post(`/api/admin/approve-role/${userId}`);
//       setPendingRequests((prevRequests) =>
//         prevRequests.filter((request) => request._id !== userId)
//       );
//     } catch (err) {
//       setError('Failed to approve role request');
//     }
//   };

//   const handleReject = async (userId) => {
//     try {
//       await axios.post(`/api/admin/reject-role/${userId}`);
//       setPendingRequests((prevRequests) =>
//         prevRequests.filter((request) => request._id !== userId)
//       );
//     } catch (err) {
//       setError('Failed to reject role request');
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       <h2>Pending Role Requests</h2>
//       {pendingRequests.length === 0 ? (
//         <p>No pending requests.</p>
//       ) : (
//         <ul>
//           {pendingRequests.map((request) => (
//             <li key={request._id}>
//               <p>
//                 <strong>{request.fullName}</strong> ({request.username}) -{' '}
//                 {request.role}
//               </p>
//               <button onClick={() => handleApprove(request._id)}>Approve</button>
//               <button onClick={() => handleReject(request._id)}>Reject</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;


const AdminDashboard = () => {
  return ( <div className="text-3xl font-bold underline bg-red-500">
    EMPTY DASHBOARD
  </div> );
}
 
export default AdminDashboard;