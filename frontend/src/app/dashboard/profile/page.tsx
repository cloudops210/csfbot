"use client";
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setUser } from '@/store/slices/authSlice';
import api from '@/lib/api';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  console.log('user.hasPassword:', user?.hasPassword);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    try {
      const res = await api.put(
        '/api/auth/profile',
        { name, email }
      );
      dispatch(setUser(res.data.user));
      setProfileMessage('Profile updated successfully!');
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordMessage('');
    setPasswordError('');
    try {
      const payload: any = { newPassword };
      if (user?.hasPassword) {
        payload.currentPassword = currentPassword;
      }
      await api.put(
        '/api/auth/change-password',
        payload
      );
      setPasswordMessage('Password updated successfully!');
      // Refresh user data to update hasPassword flag
      const res = await api.get('/api/auth/me');
      dispatch(setUser(res.data.user));
      
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* Profile Update Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
      <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
            <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          {profileMessage && <p className="text-green-600">{profileMessage}</p>}
          {profileError && <p className="text-red-600">{profileError}</p>}
          <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold">Save Changes</button>
        </form>
      </div>

      {/* Password Change/Set Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">{user?.hasPassword ? 'Change Password' : 'Set Password'}</h2>
        {!user?.hasPassword && (
          <p className="mb-4 text-sm text-gray-600">You signed up with a social provider. To enable logging in with a password, please set one below.</p>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {user?.hasPassword && (
            <div>
              <label htmlFor="currentPassword"className="block text-sm font-medium text-gray-700">Current Password</label>
              <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          )}
            <div>
            <label htmlFor="newPassword"className="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
            <div>
            <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          {passwordMessage && <p className="text-green-600">{passwordMessage}</p>}
          {passwordError && <p className="text-red-600">{passwordError}</p>}
          <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold">{user?.hasPassword ? 'Change Password' : 'Set Password'}</button>
        </form>
      </div>
    </div>
  );
} 