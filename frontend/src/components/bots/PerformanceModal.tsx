import { Bot } from '@/store/slices/botSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: Bot;
  performance: Bot['performance'] | null;
  loading: boolean;
}

export default function PerformanceModal({ 
  isOpen, 
  onClose, 
  bot, 
  performance, 
  loading 
}: PerformanceModalProps) {
  const getPerformanceColor = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value >= 0 ? 'text-green-600' : 'text-red-600';
    }
    return value >= 50 ? 'text-green-600' : value >= 30 ? 'text-yellow-600' : 'text-red-600';
  };

  const getPerformanceIcon = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value >= 0 ? (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return value >= 50 ? (
      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Performance for {bot.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Detailed performance metrics and statistics
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-500">Loading performance data...</span>
            </div>
          ) : !performance ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No performance data</h3>
              <p className="mt-1 text-sm text-gray-500">
                Performance data will appear here once the bot starts trading.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* P&L */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getPerformanceIcon(performance.pnl)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Total P&L</p>
                      <p className={`text-lg font-semibold ${getPerformanceColor(performance.pnl)}`}>
                        ${performance.pnl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Win Rate */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getPerformanceIcon(performance.winRate, false)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Win Rate</p>
                      <p className={`text-lg font-semibold ${getPerformanceColor(performance.winRate, false)}`}>
                        {performance.winRate}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trade Count */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Total Trades</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {performance.tradeCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Performance Details</h4>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Trade</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {performance.lastTradeAt 
                        ? new Date(performance.lastTradeAt).toLocaleString()
                        : 'No trades yet'
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Average P&L per Trade</dt>
                    <dd className={`mt-1 text-sm font-medium ${getPerformanceColor(performance.pnl / Math.max(performance.tradeCount, 1))}`}>
                      ${(performance.pnl / Math.max(performance.tradeCount, 1)).toFixed(2)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Success Rate</dt>
                    <dd className={`mt-1 text-sm font-medium ${getPerformanceColor(performance.winRate, false)}`}>
                      {performance.winRate >= 50 ? 'Good' : performance.winRate >= 30 ? 'Fair' : 'Poor'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Performance Status</dt>
                    <dd className={`mt-1 text-sm font-medium ${getPerformanceColor(performance.pnl)}`}>
                      {performance.pnl >= 0 ? 'Profitable' : 'Loss Making'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Performance Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Performance Summary</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        This bot has executed {performance.tradeCount} trades with a {performance.winRate}% success rate. 
                        {performance.pnl >= 0 
                          ? ` It has generated a profit of $${performance.pnl.toFixed(2)}.`
                          : ` It has incurred a loss of $${Math.abs(performance.pnl).toFixed(2)}.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 