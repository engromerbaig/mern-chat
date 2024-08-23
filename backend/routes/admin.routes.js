// admin.routes.js

import express from 'express';
import { approveRoleRequest, rejectRoleRequest, createSuperAdmin, getPendingRoleRequests, getRequestHistory } from '../controllers/admin.controller.js';
import { isSuperAdmin } from '../middleware/isSuperAdmin.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// Apply middleware to ensure only Super Admins can access these routes
router.use(protectRoute); // Ensure all routes use protectRoute middleware

router.post('/create-superadmin', createSuperAdmin); 
router.post('/approve-role/:userId', isSuperAdmin, approveRoleRequest); // userId in URL
router.post('/reject-role/:userId', isSuperAdmin, rejectRoleRequest); // userId in URL
router.get('/pending-requests', isSuperAdmin, getPendingRoleRequests);
router.get('/request-history', isSuperAdmin, getRequestHistory); //get request history


export default router;
