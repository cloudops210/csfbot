"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { getApiKeys, addApiKey, deleteApiKey } from '@/store/slices/apiKeySlice';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function ApiKeysPage() {
  useAuthGuard();
  const dispatch = useDispatch<AppDispatch>();
  const { keys, loading, error } = useSelector((state: RootState) => state.apiKeys);

  const [exchange, setExchange] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  useEffect(() => {
    dispatch(getApiKeys());
  }, [dispatch]);

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (exchange && newApiKey && apiSecret) {
      dispatch(addApiKey({ exchange, apiKey: newApiKey, apiSecret }))
        .then(() => {
          // Refetch keys after adding a new one
          dispatch(getApiKeys());
          // Reset form
          setExchange('');
          setNewApiKey('');
          setApiSecret('');
        });
    }
  };

  const handleDeleteKey = (keyId: string) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      dispatch(deleteApiKey(keyId));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black">API Key Management</h1>
        <p className="text-accent">Securely manage your exchange API keys here.</p>
      </div>

      {/* Add API Key Form */}
      <div className="bg-white p-6 rounded-lg shadow-subtle border border-border">
        <h2 className="text-lg font-semibold text-black mb-4">Add New API Key</h2>
        <form onSubmit={handleAddKey} className="space-y-4">
          <div>
            <label htmlFor="exchange" className="block text-sm font-medium text-black mb-1">Exchange</label>
            <input
              id="exchange"
              type="text"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              placeholder="e.g., Binance, Coinbase"
              className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-black mb-1">API Key</label>
            <input
              id="apiKey"
              type="text"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="Your public API key"
              className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="apiSecret" className="block text-sm font-medium text-black mb-1">API Secret</label>
            <input
              id="apiSecret"
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Your secret API key"
              className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:bg-opacity-50 transition-all"
            >
              {loading ? 'Adding...' : 'Add Key'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* List of API Keys */}
      <div className="bg-white p-6 rounded-lg shadow-subtle border border-border">
        <h2 className="text-lg font-semibold text-black mb-4">Your API Keys</h2>
        {loading && keys.length === 0 ? (
          <p>Loading keys...</p>
        ) : keys.length === 0 ? (
          <p className="text-accent">You have not added any API keys yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-accent uppercase tracking-wider">Exchange</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-accent uppercase tracking-wider">API Key</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-accent uppercase tracking-wider">Created At</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {keys.map((key) => (
                  <tr key={key._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{key.exchange}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-accent font-mono">{`${key.apiKey.substring(0, 8)}...`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-accent">{new Date(key.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteKey(key._id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 