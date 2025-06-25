import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { createBot, updateBot, clearBotError } from '@/store/slices/botSlice';
import { Bot } from '@/store/slices/botSlice';

interface BotModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode: boolean;
  selectedBot: Bot | null;
  exchanges: string[];
  apiKeys: any[];
}

type MAStrategyParams = {
  shortPeriod: number;
  longPeriod: number;
  symbol: string;
  quantity: number;
};

export default function BotModal({
  isOpen,
  onClose,
  editMode,
  selectedBot,
  exchanges,
  apiKeys,
}: BotModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.bots);

  // Main form state
  const [form, setForm] = useState({
    name: '',
    exchange: exchanges[0] || '',
    apiKeyRef: '',
  });
  // Strategy state (UI fields)
  const [strategyParams, setStrategyParams] = useState<MAStrategyParams>({
    shortPeriod: 10,
    longPeriod: 20,
    symbol: 'BTCUSDT',
    quantity: 0.001,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editMode && selectedBot) {
      setForm({
        name: selectedBot.name,
        exchange: selectedBot.exchange,
        apiKeyRef: selectedBot.apiKeyRef,
      });
      // Try to parse moving average params
      if (selectedBot.strategy?.type === 'moving_average') {
        setStrategyParams({
          shortPeriod: selectedBot.strategy.parameters.shortPeriod || 10,
          longPeriod: selectedBot.strategy.parameters.longPeriod || 20,
          symbol: selectedBot.strategy.parameters.symbol || 'BTCUSDT',
          quantity: selectedBot.strategy.parameters.quantity || 0.001,
        });
      } else {
        setStrategyParams({ shortPeriod: 10, longPeriod: 20, symbol: 'BTCUSDT', quantity: 0.001 });
      }
    } else {
      setForm({
        name: '',
        exchange: exchanges[0] || '',
        apiKeyRef: '',
      });
      setStrategyParams({ shortPeriod: 10, longPeriod: 20, symbol: 'BTCUSDT', quantity: 0.001 });
    }
    setValidationErrors({});
  }, [editMode, selectedBot, exchanges]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Bot name is required';
    if (!form.exchange) errors.exchange = 'Exchange is required';
    if (!form.apiKeyRef) errors.apiKeyRef = 'API Key is required';
    if (!strategyParams.symbol.trim()) errors.symbol = 'Symbol is required';
    if (strategyParams.shortPeriod <= 0) errors.shortPeriod = 'Short period must be positive';
    if (strategyParams.longPeriod <= 0) errors.longPeriod = 'Long period must be positive';
    if (strategyParams.shortPeriod >= strategyParams.longPeriod) errors.shortPeriod = 'Short period must be less than long period';
    if (strategyParams.quantity <= 0) errors.quantity = 'Quantity must be positive';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const payload = {
        ...form,
        strategy: {
          type: 'moving_average',
          parameters: { ...strategyParams },
        },
      };
      if (editMode && selectedBot) {
        await dispatch(updateBot({ id: selectedBot._id, data: payload })).unwrap();
      } else {
        await dispatch(createBot(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      // Error handled by Redux
    }
  };

  const handleClose = () => {
    dispatch(clearBotError());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {editMode ? 'Edit Bot' : 'Create New Bot'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bot Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Bot Name
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="My Trading Bot"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            {/* Exchange */}
            <div>
              <label htmlFor="exchange" className="block text-sm font-medium text-gray-700">
                Exchange
              </label>
              <select
                id="exchange"
                value={form.exchange}
                onChange={(e) => setForm({ ...form, exchange: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  validationErrors.exchange ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select an exchange</option>
                {exchanges.map((exchange) => (
                  <option key={exchange} value={exchange}>
                    {exchange}
                  </option>
                ))}
              </select>
              {validationErrors.exchange && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.exchange}</p>
              )}
            </div>

            {/* API Key */}
            <div>
              <label htmlFor="apiKeyRef" className="block text-sm font-medium text-gray-700">
                API Key
              </label>
              <select
                id="apiKeyRef"
                value={form.apiKeyRef}
                onChange={(e) => setForm({ ...form, apiKeyRef: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  validationErrors.apiKeyRef ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select an API key</option>
                {apiKeys
                  .filter(key => !form.exchange || key.exchange === form.exchange)
                  .map((key) => (
                    <option key={key._id} value={key._id}>
                      {key.exchange} - {key.apiKey.substring(0, 8)}...
                    </option>
                  ))}
              </select>
              {validationErrors.apiKeyRef && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.apiKeyRef}</p>
              )}
              {apiKeys.length === 0 && (
                <p className="mt-1 text-sm text-yellow-600">
                  No API keys found. Please add an API key first.
                </p>
              )}
            </div>

            {/* Strategy Configuration (UI) */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Strategy: Moving Average Crossover</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Symbol</label>
                  <input
                    type="text"
                    value={strategyParams.symbol}
                    onChange={e => setStrategyParams({ ...strategyParams, symbol: e.target.value })}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${validationErrors.symbol ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="BTCUSDT"
                  />
                  {validationErrors.symbol && <p className="mt-1 text-xs text-red-600">{validationErrors.symbol}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    min={0.00001}
                    step={0.00001}
                    value={strategyParams.quantity}
                    onChange={e => setStrategyParams({ ...strategyParams, quantity: parseFloat(e.target.value) })}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${validationErrors.quantity ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="0.001"
                  />
                  {validationErrors.quantity && <p className="mt-1 text-xs text-red-600">{validationErrors.quantity}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Short Period</label>
                  <input
                    type="number"
                    min={1}
                    value={strategyParams.shortPeriod}
                    onChange={e => setStrategyParams({ ...strategyParams, shortPeriod: parseInt(e.target.value) })}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${validationErrors.shortPeriod ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="10"
                  />
                  {validationErrors.shortPeriod && <p className="mt-1 text-xs text-red-600">{validationErrors.shortPeriod}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Long Period</label>
                  <input
                    type="number"
                    min={1}
                    value={strategyParams.longPeriod}
                    onChange={e => setStrategyParams({ ...strategyParams, longPeriod: parseInt(e.target.value) })}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${validationErrors.longPeriod ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="20"
                  />
                  {validationErrors.longPeriod && <p className="mt-1 text-xs text-red-600">{validationErrors.longPeriod}</p>}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                This strategy buys when the short moving average crosses above the long moving average, and sells when it crosses below.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {editMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editMode ? 'Update Bot' : 'Create Bot'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 