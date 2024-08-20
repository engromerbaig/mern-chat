// src/pages/PendingApproval.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';  // Optional: For setting the page title

const PendingApproval = () => {
  return (
    <div className="pending-approval">
      <Helmet>
        <title>Pending Approval</title>
      </Helmet>
      <h1>Pending Approval</h1>
      <p>Your request has been submitted successfully.</p>
      <p>
        You will be notified once your role request is approved. In the meantime, you can <Link to="/">return to the home page</Link> or check your email for updates.
      </p>
      <p>If you have any questions, please contact support.</p>
    </div>
  );
};

export default PendingApproval;
