import { appConfig } from '@/config/app'
import { buildOrderSchema } from '@/features/order/schemas/orderSchema'
import type { OrderDraft } from '@/types/order'

export const validateOrder = (order: OrderDraft) =>
  buildOrderSchema(appConfig.rules.maxToppingsPerPot).safeParse(order)
