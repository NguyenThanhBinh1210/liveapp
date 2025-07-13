import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { 
  getWalletBalance, 
  requestTopup, 
  requestWithdraw,
  getTransactionHistory,
  validateTopupData,
  validateWithdrawData,
  formatCurrency,
  getTransactionStatusColor,
  getTransactionTypeIcon,
  getTransactionTypeColor,
  formatTransactionAmount,
  type TopupRequest,
  type WithdrawRequest,
  // type WalletTransaction,
  type TransactionQueryParams
} from '~/apis/wallet.api'
import { ArrowLeft, Wallet as WalletIcon, Plus, Minus, History, CreditCard } from 'lucide-react'

type TabType = 'balance' | 'topup' | 'withdraw' | 'history'

const Wallet: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [activeTab, setActiveTab] = useState<TabType>('balance')
  const [topupForm, setTopupForm] = useState<TopupRequest>({
    amount: 0,
    note: ''
  })
  const [withdrawForm, setWithdrawForm] = useState<WithdrawRequest>({
    amount: 0,
    bankAccount: '',
    bankName: '',
    accountHolder: '',
    note: ''
  })
  const [historyFilters, setHistoryFilters] = useState<TransactionQueryParams>({
    page: 1,
    limit: 20
  })

  // Queries
  const balanceQuery = useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: getWalletBalance,
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  const historyQuery = useQuery({
    queryKey: ['wallet', 'history', historyFilters],
    queryFn: () => getTransactionHistory(historyFilters),
    enabled: activeTab === 'history'
  })

  // Mutations
  const topupMutation = useMutation({
    mutationFn: requestTopup,
    onSuccess: (_data) => {
      toast.success(t('topup_request_submitted'))
      setTopupForm({ amount: 0, note: '' })
      queryClient.invalidateQueries(['wallet'])
    },
    onError: (error: any) => {
      let errorMessage = t('topup_request_failed')
      if (error?.response?.status === 400) {
        errorMessage = t('invalid_topup_data')
      }
      toast.error(errorMessage)
    }
  })

  const withdrawMutation = useMutation({
    mutationFn: requestWithdraw,
    onSuccess: (_data) => {
      toast.success(t('withdraw_request_submitted'))
      setWithdrawForm({
        amount: 0,
        bankAccount: '',
        bankName: '',
        accountHolder: '',
        note: ''
      })
      queryClient.invalidateQueries(['wallet'])
    },
    onError: (error: any) => {
      let errorMessage = t('withdraw_request_failed')
      if (error?.response?.status === 400) {
        errorMessage = t('invalid_withdraw_data')
      }
      toast.error(errorMessage)
    }
  })

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateTopupData(topupForm)
    if (errors.length > 0) {
      toast.error(errors[0])
      return
    }
    
    topupMutation.mutate(topupForm)
  }

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const currentBalance = balanceQuery.data?.balance || 0
    const errors = validateWithdrawData(withdrawForm, currentBalance)
    if (errors.length > 0) {
      toast.error(errors[0])
      return
    }
    
    withdrawMutation.mutate(withdrawForm)
  }

  const renderBalanceTab = () => (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <WalletIcon className="w-6 h-6" />
            <h3 className="text-lg font-semibold">{t('current_balance')}</h3>
          </div>
          <CreditCard className="w-8 h-8 opacity-50" />
        </div>
        
        <div className="mb-2">
          <span className="text-3xl font-bold">
            {balanceQuery.data ? formatCurrency(balanceQuery.data.balance) : '---'}
          </span>
        </div>
        
        <p className="text-blue-100 text-sm">
          {t('last_updated')}: {balanceQuery.data ? new Date(balanceQuery.data.lastUpdated).toLocaleString() : '---'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('topup')}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">{t('topup')}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('withdraw')}
          className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg transition-colors"
        >
          <Minus className="w-5 h-5" />
          <span className="font-medium">{t('withdraw')}</span>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('recent_transactions')}
          </h3>
          <button
            onClick={() => setActiveTab('history')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {t('view_all')}
          </button>
        </div>
        
        {historyQuery.data?.transactions.slice(0, 5).map((transaction) => (
          <div key={transaction._id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getTransactionTypeIcon(transaction.type)}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {t(transaction.type.toLowerCase())}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                {formatTransactionAmount(transaction)}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${getTransactionStatusColor(transaction.status)}`}>
                {t(transaction.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTopupTab = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Plus className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('topup_wallet')}
        </h3>
      </div>

      <form onSubmit={handleTopupSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('amount')} (VND) *
          </label>
          <input
            type="number"
            min="10000"
            max="10000000"
            step="1000"
            value={topupForm.amount || ''}
            onChange={(e) => setTopupForm(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            placeholder="10,000 - 10,000,000"
          />
          <p className="text-sm text-gray-500 mt-1">
            {t('min_amount')}: 10,000 VND - {t('max_amount')}: 10,000,000 VND
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('note')} ({t('optional')})
          </label>
          <textarea
            value={topupForm.note}
            onChange={(e) => setTopupForm(prev => ({ ...prev, note: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            rows={3}
            placeholder={t('enter_note')}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {topupForm.note?.length || 0}/500
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ {t('topup_notice')}
          </p>
        </div>

        <button
          type="submit"
          disabled={topupMutation.isLoading || !topupForm.amount}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          {topupMutation.isLoading ? t('submitting') : t('submit_topup_request')}
        </button>
      </form>
    </div>
  )

  const renderWithdrawTab = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Minus className="w-6 h-6 text-red-600" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('withdraw_money')}
        </h3>
      </div>

      <form onSubmit={handleWithdrawSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('amount')} (VND) *
          </label>
          <input
            type="number"
            min="50000"
            max={balanceQuery.data?.balance || 0}
            step="1000"
            value={withdrawForm.amount || ''}
            onChange={(e) => setWithdrawForm(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="50,000"
          />
          <p className="text-sm text-gray-500 mt-1">
            {t('min_amount')}: 50,000 VND - {t('max_amount')}: {formatCurrency(balanceQuery.data?.balance || 0)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('bank_account')} *
          </label>
          <input
            type="text"
            value={withdrawForm.bankAccount}
            onChange={(e) => setWithdrawForm(prev => ({ ...prev, bankAccount: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder={t('enter_bank_account')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('bank_name')} *
          </label>
          <input
            type="text"
            value={withdrawForm.bankName}
            onChange={(e) => setWithdrawForm(prev => ({ ...prev, bankName: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder={t('enter_bank_name')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('account_holder')} *
          </label>
          <input
            type="text"
            value={withdrawForm.accountHolder}
            onChange={(e) => setWithdrawForm(prev => ({ ...prev, accountHolder: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder={t('enter_account_holder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('note')} ({t('optional')})
          </label>
          <textarea
            value={withdrawForm.note}
            onChange={(e) => setWithdrawForm(prev => ({ ...prev, note: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            rows={3}
            placeholder={t('enter_note')}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {withdrawForm.note?.length || 0}/500
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            ⚠️ {t('withdraw_notice')}
          </p>
        </div>

        <button
          type="submit"
          disabled={withdrawMutation.isLoading || !withdrawForm.amount || !withdrawForm.bankAccount || !withdrawForm.bankName || !withdrawForm.accountHolder}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          {withdrawMutation.isLoading ? t('submitting') : t('submit_withdraw_request')}
        </button>
      </form>
    </div>
  )

  const renderHistoryTab = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('filter_transactions')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('transaction_type')}
            </label>
            <select
              value={historyFilters.type || ''}
              onChange={(e) => setHistoryFilters(prev => ({ ...prev, type: e.target.value as any || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{t('all_types')}</option>
              <option value="TOPUP">{t('topup')}</option>
              <option value="WITHDRAW">{t('withdraw')}</option>
              <option value="GIFT">{t('gift')}</option>
              <option value="REWARD">{t('reward')}</option>
              <option value="REFERRAL">{t('referral')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('status')}
            </label>
            <select
              value={historyFilters.status || ''}
              onChange={(e) => setHistoryFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{t('all_statuses')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="approved">{t('approved')}</option>
              <option value="completed">{t('completed')}</option>
              <option value="rejected">{t('rejected')}</option>
              <option value="failed">{t('failed')}</option>
              <option value="cancelled">{t('cancelled')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('transaction_history')}
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {historyQuery.data?.transactions.map((transaction) => (
            <div key={transaction._id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTransactionTypeIcon(transaction.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {t(transaction.type.toLowerCase())}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                    {formatTransactionAmount(transaction)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTransactionStatusColor(transaction.status)}`}>
                    {t(transaction.status)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {transaction.description}
              </p>
              
              {transaction.note && (
                <p className="text-sm text-gray-500 italic">
                  {t('note')}: {transaction.note}
                </p>
              )}
              
              {transaction.adminNote && (
                <p className="text-sm text-blue-600 dark:text-blue-400 italic">
                  {t('admin_note')}: {transaction.adminNote}
                </p>
              )}
            </div>
          ))}
        </div>
        
        {historyQuery.data?.transactions.length === 0 && (
          <div className="text-center py-8">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('no_transactions_found')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('no_transactions_message')}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <WalletIcon className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('wallet')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          {[
            { key: 'balance', label: t('balance'), icon: WalletIcon },
            { key: 'topup', label: t('topup'), icon: Plus },
            { key: 'withdraw', label: t('withdraw'), icon: Minus },
            { key: 'history', label: t('history'), icon: History }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {activeTab === 'balance' && renderBalanceTab()}
        {activeTab === 'topup' && renderTopupTab()}
        {activeTab === 'withdraw' && renderWithdrawTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </div>
    </div>
  )
}

export default Wallet 