import React from 'react';
import { formatDateAndTime } from '../../utils/extractTime';

const RejectedRequestsTab = ({ rejectedRequests }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Rejected Requests</h2>
      {rejectedRequests.length === 0 ? (
        <p className="text-gray-600 text-center">No rejected requests.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-4">
          {rejectedRequests.map((request) => (
            <li key={request._id} className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <p className="text-xl mb-3 text-gray-800">
                <strong>{request.fullName}</strong> ({request.username}) - {request.role}
              </p>
             
              {request.rejectedAt && (
                <p className="text-red-500 pb-3 text-sm">
                  Rejected at: {formatDateAndTime(request.rejectedAt)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RejectedRequestsTab;