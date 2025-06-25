import { Request, Response } from 'express';
import Bot from '../models/Bot';
import User from '../models/User';
import BotLog from '../models/BotLog';
import ApiKey from '../models/ApiKey';

// POST /api/bots - Create a new bot
export const createBot = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const { name, exchange, apiKeyRef, strategy } = req.body;

  // Fetch user and check subscription
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  if (user.subscriptionStatus !== 'active') {
    res.status(403).json({ message: 'You must have an active subscription to create a bot.' });
    return;
  }

  // Validate API key ownership
  const apiKey = await ApiKey.findOne({ _id: apiKeyRef, user: userId });
  if (!apiKey) {
    res.status(400).json({ message: 'Invalid API key reference.' });
    return;
  }

  // Example: Basic plan allows up to 2 bots
  const botCount = await Bot.countDocuments({ user: userId });
  if (user.subscriptionPlan === 'Basic' && botCount >= 2) {
    res.status(403).json({ message: 'Basic plan allows up to 2 bots.' });
    return;
  }

  // (You can add more plan logic here)

  // Create the bot
  const bot = new Bot({
    user: userId,
    name,
    exchange,
    apiKeyRef,
    strategy,
    status: 'stopped',
  });
  await bot.save();

  res.status(201).json({ bot });
};

// GET /api/bots - List all bots for the user
export const listBots = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const bots = await Bot.find({ user: userId });
  res.json({ bots });
};

// PUT /api/bots/:id - Update a bot (name, strategy, etc.)
export const updateBot = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const botId = req.params.id;
  const { name, strategy } = req.body;

  const bot = await Bot.findOne({ _id: botId, user: userId });
  if (!bot) {
    res.status(404).json({ message: 'Bot not found' });
    return;
  }
  if (name) bot.name = name;
  if (strategy) bot.strategy = strategy;
  await bot.save();
  res.json({ bot });
};

// DELETE /api/bots/:id - Delete a bot
export const deleteBot = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const botId = req.params.id;
  const bot = await Bot.findOneAndDelete({ _id: botId, user: userId });
  if (!bot) {
    res.status(404).json({ message: 'Bot not found' });
    return;
  }
  res.json({ message: 'Bot deleted' });
};

// POST /api/bots/:id/toggle - Start or stop a bot
export const toggleBot = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const botId = req.params.id;
  const { action } = req.body; // 'start' or 'stop'

  const bot = await Bot.findOne({ _id: botId, user: userId });
  if (!bot) {
    res.status(404).json({ message: 'Bot not found' });
    return;
  }
  if (action === 'start') {
    bot.status = 'running';
  } else if (action === 'stop') {
    bot.status = 'stopped';
  } else {
    res.status(400).json({ message: 'Invalid action' });
    return;
  }
  await bot.save();
  res.json({ bot });
};

// GET /api/bots/:id/logs - Get logs for a bot
export const getBotLogs = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const botId = req.params.id;
  const bot = await Bot.findOne({ _id: botId, user: userId });
  if (!bot) {
    res.status(404).json({ message: 'Bot not found' });
    return;
  }
  const logs = await BotLog.find({ bot: botId }).sort({ timestamp: -1 });
  res.json({ logs });
};

// GET /api/bots/:id/performance - Get performance stats for a bot
export const getBotPerformance = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const botId = req.params.id;
  const bot = await Bot.findOne({ _id: botId, user: userId });
  if (!bot) {
    res.status(404).json({ message: 'Bot not found' });
    return;
  }
  res.json({ performance: bot.performance });
}; 