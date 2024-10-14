//  frontend/src/components/adminTabs/AcceptedRequestsTab.jsx
import React from 'react';
import { formatDateAndTime } from '../../utils/extractTime';

const AcceptedRequestsTab = ({ acceptedRequests }) => {
  // Sort accepted requests by the approvedAt time (latest first)
  const sortedAcceptedRequests = [...acceptedRequests].sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Accepted Requests</h2>
      {sortedAcceptedRequests.length === 0 ? (
        <p className="text-gray-600 text-center">No accepted requests.</p>
      ) : (
        <ul className="grid md:grid-cols-3 gap-4">
          {sortedAcceptedRequests.map((request) => (
            <li key={request._id} className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <p className="text-xl mb-3 text-gray-800">
                <strong>{request.fullName}</strong> ({request.username}) - {request.role}
              </p>
              
              {request.approvedAt && (
                <p className="text-green-500 pb-3 text-sm">
                  Accepted at: {formatDateAndTime(request.approvedAt)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcceptedRequestsTab;
