"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  listBots,
  createBot,
  updateBot,
  deleteBot,
  toggleBot,
  getBotLogs,
  getBotPerformance,
  setSelectedBot,
  clearBotError,
} from "@/store/slices/botSlice";
import { getApiKeys } from "@/store/slices/apiKeySlice";
import BotCard from "@/components/bots/BotCard";
import BotModal from "@/components/bots/BotModal";
import LogsModal from "@/components/bots/LogsModal";
import PerformanceModal from "@/components/bots/PerformanceModal";
import EmptyState from "@/components/bots/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const EXCHANGES = ["Binance", "Coinbase", "Kraken", "Kucoin", "Bybit"];

export default function BotsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { bots, selectedBot, logs, performance, loading, error } = useSelector((state: RootState) => state.bots);
  const { keys } = useSelector((state: RootState) => state.apiKeys);
  const [showModal, setShowModal] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showPerf, setShowPerf] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(listBots());
    dispatch(getApiKeys());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (bot: any) => {
    dispatch(setSelectedBot(bot));
    setEditMode(true);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    dispatch(setSelectedBot(null));
    dispatch(clearBotError());
  };

  const handleShowLogs = (bot: any) => {
    dispatch(setSelectedBot(bot));
    dispatch(getBotLogs(bot._id));
    setShowLogs(true);
  };

  const handleShowPerf = (bot: any) => {
    dispatch(setSelectedBot(bot));
    dispatch(getBotPerformance(bot._id));
    setShowPerf(true);
  };

  const handleToggle = (bot: any, action: "start" | "stop") => {
    dispatch(toggleBot({ id: bot._id, action }));
  };

  const handleDelete = (botId: string) => {
    if (window.confirm("Are you sure you want to delete this bot? This action cannot be undone.")) {
      dispatch(deleteBot(botId));
    }
  };

  // Calculate summary stats
  const totalBots = bots.length;
  const runningBots = bots.filter(bot => bot.status === 'running').length;
  const totalPnL = bots.reduce((sum, bot) => sum + (bot.performance?.pnl || 0), 0);
  const avgWinRate = bots.length > 0 
    ? bots.reduce((sum, bot) => sum + (bot.performance?.winRate || 0), 0) / bots.length 
    : 0;

  if (loading && bots.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trading Bots</h1>
            <p className="text-gray-600 mt-1">Manage your automated trading strategies</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Bot
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Bots</dt>
                    <dd className="text-lg font-medium text-gray-900">{totalBots}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Running</dt>
                    <dd className="text-lg font-medium text-gray-900">{runningBots}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total P&L</dt>
                    <dd className={`text-lg font-medium ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${totalPnL.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Win Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{avgWinRate.toFixed(1)}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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

      {/* Bots Grid */}
      {bots.length === 0 ? (
        <EmptyState onCreateBot={openCreateModal} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <BotCard
              key={bot._id}
              bot={bot}
              onEdit={() => openEditModal(bot)}
              onDelete={() => handleDelete(bot._id)}
              onToggle={(action) => handleToggle(bot, action)}
              onShowLogs={() => handleShowLogs(bot)}
              onShowPerf={() => handleShowPerf(bot)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <BotModal
          isOpen={showModal}
          onClose={handleModalClose}
          editMode={editMode}
          selectedBot={selectedBot}
          exchanges={EXCHANGES}
          apiKeys={keys}
        />
      )}

      {showLogs && selectedBot && (
        <LogsModal
          isOpen={showLogs}
          onClose={() => setShowLogs(false)}
          bot={selectedBot}
          logs={logs}
          loading={loading}
        />
      )}

      {showPerf && selectedBot && (
        <PerformanceModal
          isOpen={showPerf}
          onClose={() => setShowPerf(false)}
          bot={selectedBot}
          performance={performance}
          loading={loading}
        />
      )}
    </div>
  );
} 