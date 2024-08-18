// admin.routes.js
import express from 'express';
import { approveRoleRequest, rejectRoleRequest, createSuperAdmin , getPendingRoleRequests } from '../controllers/admin.controller.js';
import { isSuperAdmin } from '../middleware/isSuperAdmin.js';

const router = express.Router();

// Apply middleware to ensure only Super Admins can access these routes
router.post('/create-superadmin', createSuperAdmin);

router.post('/approve-role', isSuperAdmin, approveRoleRequest);
router.post('/reject-role', isSuperAdmin, rejectRoleRequest);

// created route for pending requests
router.post('/pending-requests', isSuperAdmin, getPendingRoleRequests);


export default router;
