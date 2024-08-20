// admin.routes.js

import express from 'express';
import { approveRoleRequest, rejectRoleRequest, createSuperAdmin, getPendingRoleRequests } from '../controllers/admin.controller.js';
import {isSuperAdmin} from '../middleware/isSuperAdmin.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// Apply middleware to ensure only Super Admins can access these routes
router.use(protectRoute); // Ensure all routes use protectRoute middleware

router.post('/create-superadmin', createSuperAdmin); 
router.post('/approve-role', isSuperAdmin, approveRoleRequest);
router.post('/reject-role', isSuperAdmin, rejectRoleRequest);
router.get('/pending-requests', isSuperAdmin, getPendingRoleRequests);

export default router;
