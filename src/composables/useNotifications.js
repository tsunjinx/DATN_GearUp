// Composable thông báo (notifications): quản lý danh sách, đếm chưa đọc, polling định kỳ và lưu/pkhôi phục từ localStorage.
import { shallowRef, ref, computed, onUnmounted } from 'vue'

const STORAGE_KEY = 'gearup-notifications'

export function useNotifications() {
  const notifications = shallowRef([])
  const pollingId = ref(null)

  const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        notifications.value = parsed.map(n => ({ ...n, timestamp: new Date(n.timestamp) }))
      }
    } catch {}
  }

  const saveToStorage = () => {
    try {
      const toSave = notifications.value.map(n => ({
        ...n,
        timestamp: n.timestamp instanceof Date ? n.timestamp.toISOString() : n.timestamp
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch {}
  }

  const seedIfEmpty = () => {
    if (notifications.value.length === 0) {
      notifications.value = [
        {
          id: 1,
          title: 'Đơn hàng mới',
          message: 'Đơn hàng #1234 vừa được đặt',
          icon: '🛒',
          timestamp: new Date(),
          isRead: false,
          type: 'order'
        }
      ]
    }
  }

  const poll = async () => {
    // Placeholder: Merge in a fake notification occasionally
    const now = new Date()
    if (Math.random() < 0.15) {
      const id = Date.now()
      notifications.value = [
        {
          id,
          title: 'Cập nhật kho',
          message: 'Một sản phẩm vừa giảm tồn',
          icon: '⚠️',
          timestamp: now,
          isRead: false,
          type: 'inventory'
        },
        ...notifications.value
      ]
      saveToStorage()
    }
  }

  const startPolling = (intervalMs = 15000) => {
    if (pollingId.value) return
    loadFromStorage()
    seedIfEmpty()
    pollingId.value = setInterval(poll, intervalMs)
  }

  const stopPolling = () => {
    if (pollingId.value) {
      clearInterval(pollingId.value)
      pollingId.value = null
    }
  }

  const markAsRead = id => {
    const idx = notifications.value.findIndex(n => n.id === id)
    if (idx !== -1) {
      notifications.value[idx] = { ...notifications.value[idx], isRead: true }
      notifications.value = [...notifications.value]
      saveToStorage()
    }
  }

  const markAllAsRead = () => {
    notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
    saveToStorage()
  }

  onUnmounted(stopPolling)

  return {
    notifications,
    unreadCount,
    startPolling,
    stopPolling,
    markAsRead,
    markAllAsRead
  }
}
