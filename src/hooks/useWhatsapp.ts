import { buildWhatsappMessage, openWhatsappWindow } from '@/services/whatsapp'
import type { OrderDraft } from '@/types/order'

export const useWhatsapp = () => ({
  sendOrder: (orderId: string, order: OrderDraft) => {
    const message = buildWhatsappMessage({ orderId, order })
    return openWhatsappWindow(message)
  },
})
