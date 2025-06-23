import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import crypto from 'crypto';

const frontend = process.env.FRONTEND;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Mock email sender
const sendEmail = async (to: string, subject: string, text: string) => {
  console.log(`Email to ${to}: ${subject}\n${text}`);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({
      email,
      password: hashedPassword,
      name,
      emailVerificationToken,
    });
    await user.save();
    // Send verification email (mock)
    const verificationLink = `${frontend}/auth/verify-email?email=${encodeURIComponent(email)}&token=${emailVerificationToken}`;
    await sendEmail(email, 'Verify your email', `Click the link to verify: ${verificationLink}\nOr use this token: ${emailVerificationToken}`);
    console.log(`Verification link: ${verificationLink}`);
    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    if (!user.isEmailVerified) {
      res.status(403).json({ message: 'Email not verified' });
      return;
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.emailVerificationToken !== token) {
      res.status(400).json({ message: 'Invalid token' });
      return;
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    await user.save();
    const resetLink = `${frontend}/auth/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;
    await sendEmail(email, 'Reset your password', `Click the link to reset: ${resetLink}\nOr use this token: ${resetToken}`);
    console.log(`Password reset link: ${resetLink}`);
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetPasswordToken !== token) {
      res.status(400).json({ message: 'Invalid token' });
      return;
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  console.log('me');
  try {
    const userId = (req.user as any)?.id;
    console.log(req.user);
    const user = await User.findById(userId).select('-password -emailVerificationToken -resetPasswordToken -twoFASecret');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    // Passport attaches user to req after successful auth
    const user = req.user as any;
    if (!user) {
      return res.status(401).json({ message: 'Google authentication failed' });
    }
    const JWT_SECRET = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    // Redirect to frontend with token (adjust URL as needed)
    const frontendUrl = process.env.FRONTEND;
    return res.redirect(`${frontendUrl}/auth?token=${token}`);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}; 