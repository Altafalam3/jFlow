
import express from 'express';
import {
  getAllApplications,
  addApplication,
  updateApplicationStatus,
  deleteApplication
} from '../controllers/ApplicationController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllApplications);
router.post('/', addApplication);
router.patch('/:id', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;
