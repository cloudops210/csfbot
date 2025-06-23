"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useAuthGuard } from "../../../hooks/useAuthGuard";

export default function ProfilePage() {
  useAuthGuard();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black">Profile & Security</h1>
        <p className="text-accent">Manage your account settings and security preferences.</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-subtle p-8 border border-border">
        <h2 className="text-lg font-semibold text-black mb-6">Profile Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
              {user?.name?.[0] || user?.email?.[0] || "U"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">{user?.name || "User"}</h3>
              <p className="text-accent">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Full Name</label>
              <div className="px-3 py-2 bg-secondary rounded-md border border-border">
                {user?.name || "Not provided"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Email Address</label>
              <div className="px-3 py-2 bg-secondary rounded-md border border-border">
                {user?.email || "Not provided"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-subtle p-8 border border-border">
        <h2 className="text-lg font-semibold text-black mb-6">Security Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <h3 className="font-semibold text-black">Two-Factor Authentication</h3>
              <p className="text-sm text-accent">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-opacity-90 transition-all">
              Enable 2FA
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <h3 className="font-semibold text-black">Change Password</h3>
              <p className="text-sm text-accent">Update your account password</p>
            </div>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-opacity-90 transition-all">
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-subtle p-8 border border-border">
        <h2 className="text-lg font-semibold text-black mb-6">Account Actions</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-red-800">Delete Account</h3>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 