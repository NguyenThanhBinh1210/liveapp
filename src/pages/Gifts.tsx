import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { 
  getRewardGifts, 
  getPremiumGifts,
  getSentGiftsHistory,
  getReceivedGiftsHistory,
  claimGift,
  sendGift,
  formatGiftPrice,
  getGiftRarityBadge,
  type Gift,
  type GiftTransaction,
  type SendGiftData
} from '~/apis/gift.api'
import { ArrowLeft, Gift as GiftIcon, Send, Clock, Star, Crown } from 'lucide-react'

type TabType = 'rewards' | 'premium' | 'sent' | 'received'

const Gifts: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [activeTab, setActiveTab] = useState<TabType>('rewards')
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const [showSendModal, setShowSendModal] = useState(false)
  const [sendForm, setSendForm] = useState({
    receiverId: '',
    streamId: '',
    quantity: 1,
    message: ''
  })

  // Queries
  const rewardGiftsQuery = useQuery({
    queryKey: ['gifts', 'rewards'],
    queryFn: () => getRewardGifts({ limit: 20 }),
    enabled: activeTab === 'rewards'
  })

  const premiumGiftsQuery = useQuery({
    queryKey: ['gifts', 'premium'],
    queryFn: () => getPremiumGifts({ limit: 20 }),
    enabled: activeTab === 'premium'
  })

  const sentHistoryQuery = useQuery({
    queryKey: ['gifts', 'sent'],
    queryFn: () => getSentGiftsHistory({ limit: 20 }),
    enabled: activeTab === 'sent'
  })

  const receivedHistoryQuery = useQuery({
    queryKey: ['gifts', 'received'],
    queryFn: () => getReceivedGiftsHistory({ limit: 20 }),
    enabled: activeTab === 'received'
  })

  // Mutations
  const claimMutation = useMutation({
    mutationFn: claimGift,
    onSuccess: (_data) => {
      toast.success(t('gift_claimed_successfully'))
      queryClient.invalidateQueries(['gifts'])
    },
    onError: (error: any) => {
      let errorMessage = t('failed_to_claim_gift')
      if (error?.response?.status === 400) {
        errorMessage = t('gift_already_claimed')
      }
      toast.error(errorMessage)
    }
  })

  const sendMutation = useMutation({
    mutationFn: sendGift,
    onSuccess: (_data) => {
      toast.success(t('gift_sent_successfully'))
      setShowSendModal(false)
      setSendForm({ receiverId: '', streamId: '', quantity: 1, message: '' })
      queryClient.invalidateQueries(['gifts'])
      queryClient.invalidateQueries(['wallet'])
    },
    onError: (error: any) => {
      let errorMessage = t('failed_to_send_gift')
      if (error?.response?.status === 400) {
        errorMessage = t('insufficient_balance')
      }
      toast.error(errorMessage)
    }
  })

  const handleClaimGift = (giftId: string) => {
    claimMutation.mutate(giftId)
  }

  const handleSendGift = () => {
    if (!selectedGift || !sendForm.receiverId) {
      toast.error(t('please_fill_required_fields'))
      return
    }

    const sendData: SendGiftData = {
      giftId: selectedGift._id,
      receiverId: sendForm.receiverId,
      quantity: sendForm.quantity,
      message: sendForm.message || undefined,
      streamId: sendForm.streamId || undefined
    }

    sendMutation.mutate(sendData)
  }

  const renderGiftCard = (gift: Gift) => (
    <div key={gift._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <img 
          src={gift.iconUrl} 
          alt={gift.name}
          className="w-12 h-12 rounded-lg"
        />
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${getGiftRarityBadge(gift.rarity)}`}>
            {t(gift.rarity)}
          </span>
          {gift.rarity === 'legendary' && <Crown className="w-4 h-4 text-yellow-500" />}
          {gift.rarity === 'epic' && <Star className="w-4 h-4 text-purple-500" />}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{gift.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{gift.description}</p>
      
      <div className="flex items-center justify-between">
        <span className={`font-bold ${gift.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
          {formatGiftPrice(gift.price)}
        </span>
        
        <div className="flex space-x-2">
          {gift.price === 0 ? (
            <button
              onClick={() => handleClaimGift(gift._id)}
              disabled={claimMutation.isLoading}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md disabled:bg-gray-400"
            >
              {claimMutation.isLoading ? t('claiming') : t('claim')}
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedGift(gift)
                setShowSendModal(true)
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center space-x-1"
            >
              <Send className="w-3 h-3" />
              <span>{t('send')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const renderHistoryItem = (transaction: GiftTransaction) => (
    <div key={transaction._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={transaction.gift.iconUrl} 
            alt={transaction.gift.name}
            className="w-10 h-10 rounded-lg"
          />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{transaction.gift.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activeTab === 'sent' ? t('sent_to') : t('received_from')}: {' '}
              {activeTab === 'sent' ? transaction.receiver?.name : transaction.sender?.name}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-semibold text-gray-900 dark:text-white">
            {transaction.quantity}x - {formatGiftPrice(transaction.totalAmount)}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(transaction.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {transaction.message && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
          "{transaction.message}"
        </p>
      )}
    </div>
  )

  const getCurrentData = () => {
    switch (activeTab) {
      case 'rewards':
        return rewardGiftsQuery.data?.gifts || []
      case 'premium':
        return premiumGiftsQuery.data?.gifts || []
      case 'sent':
        return sentHistoryQuery.data?.transactions || []
      case 'received':
        return receivedHistoryQuery.data?.transactions || []
      default:
        return []
    }
  }

  const isLoading = rewardGiftsQuery.isLoading || premiumGiftsQuery.isLoading || 
                   sentHistoryQuery.isLoading || receivedHistoryQuery.isLoading

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
              <GiftIcon className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('gifts')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          {[
            { key: 'rewards', label: t('reward_gifts'), icon: GiftIcon },
            { key: 'premium', label: t('premium_gifts'), icon: Crown },
            { key: 'sent', label: t('sent_gifts'), icon: Send },
            { key: 'received', label: t('received_gifts'), icon: Clock }
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTab === 'rewards' || activeTab === 'premium' ? (
              (getCurrentData() as Gift[]).map((gift: Gift) => renderGiftCard(gift))
            ) : (
              <div className="col-span-full">
                {(getCurrentData() as GiftTransaction[]).map((transaction: GiftTransaction) => renderHistoryItem(transaction))}
              </div>
            )}
          </div>
        )}

        {getCurrentData().length === 0 && !isLoading && (
          <div className="text-center py-12">
            <GiftIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('no_gifts_found')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'rewards' && t('no_reward_gifts_available')}
              {activeTab === 'premium' && t('no_premium_gifts_available')}
              {activeTab === 'sent' && t('no_sent_gifts_history')}
              {activeTab === 'received' && t('no_received_gifts_history')}
            </p>
          </div>
        )}
      </div>

      {/* Send Gift Modal */}
      {showSendModal && selectedGift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('send_gift')}
                </h3>
                <button
                  onClick={() => setShowSendModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img 
                  src={selectedGift.iconUrl} 
                  alt={selectedGift.name}
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{selectedGift.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatGiftPrice(selectedGift.price)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('receiver_id')} *
                  </label>
                  <input
                    type="text"
                    value={sendForm.receiverId}
                    onChange={(e) => setSendForm(prev => ({ ...prev, receiverId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder={t('enter_receiver_id')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('quantity')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={sendForm.quantity}
                    onChange={(e) => setSendForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('message')} ({t('optional')})
                  </label>
                  <textarea
                    value={sendForm.message}
                    onChange={(e) => setSendForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder={t('enter_message')}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {sendForm.message.length}/200
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {t('total_cost')}: {formatGiftPrice(selectedGift.price * sendForm.quantity)}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSendGift}
                  disabled={sendMutation.isLoading || !sendForm.receiverId}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md"
                >
                  {sendMutation.isLoading ? t('sending') : t('send_gift')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gifts 