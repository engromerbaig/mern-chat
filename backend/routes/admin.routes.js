// admin.routes.js
import express from 'express';
import { approveRoleRequest, rejectRoleRequest } from '../controllers/admin.controller.js';
import { isSuperAdmin } from '../middleware/isSuperAdmin.js';
const router = express.Router();

router.use(isSuperAdmin); // Apply middleware to ensure only Super Admins can access these routes

router.post('/approve-role', approveRoleRequest);
router.post('/reject-role', rejectRoleRequest);

export default router;
