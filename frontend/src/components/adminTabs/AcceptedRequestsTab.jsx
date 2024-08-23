import React from 'react';
import { formatDateAndTime } from '../../utils/extractTime';

const AcceptedRequestsTab = ({ acceptedRequests }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Accepted Requests</h2>
      {acceptedRequests.length === 0 ? (
        <p className="text-gray-600 text-center">No accepted requests.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-4">
          {acceptedRequests.map((request) => (
            <li key={request._id} className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <p className="text-xl mb-3 text-gray-800">
                <strong>{request.fullName}</strong> ({request.username}) - {request.role}
              </p>
              <p className="text-gray-500 pb-3 text-sm">
                Approved at: {formatDateAndTime(request.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcceptedRequestsTab;
