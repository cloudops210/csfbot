import express from 'express';
import { createBot, listBots, updateBot, deleteBot, toggleBot, getBotLogs, getBotPerformance } from '../controllers/botController';
import auth from '../middleware/auth';

const router = express.Router();

// Create a new bot
router.post('/', auth, createBot);
// List all bots for the user
router.get('/', auth, listBots);
// Update a bot
router.put('/:id', auth, updateBot);
// Delete a bot
router.delete('/:id', auth, deleteBot);
// Start/stop a bot
router.post('/:id/toggle', auth, toggleBot);
// Get logs for a bot
router.get('/:id/logs', auth, getBotLogs);
// Get performance stats for a bot
router.get('/:id/performance', auth, getBotPerformance);

export default router; 