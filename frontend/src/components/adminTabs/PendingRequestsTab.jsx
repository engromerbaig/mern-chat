import React from 'react';
import { formatDateAndTime } from '../../utils/extractTime';

const PendingRequestsTab = ({ pendingRequests, handleApprove, handleReject }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Pending Role Requests</h2>
      {pendingRequests.length === 0 ? (
        <p className="text-gray-600 text-center">No pending requests.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-4">
          {pendingRequests.map((request) => (
            <li key={request._id} className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <p className="text-xl mb-3 text-gray-800">
                <strong>{request.fullName}</strong> ({request.username}) - {request.role}
              </p>
              <p className="text-gray-500 pb-3 text-sm">
                Requested at: {formatDateAndTime(request.createdAt)}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(request._id)}
                  className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingRequestsTab;