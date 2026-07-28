import { useOrderStore } from '@/store/order-store'
import { calculateOrderSummary } from '@/utils/orderCalculations'

export const useOrder = () => {
  const store = useOrderStore((state) => ({
    pots: state.pots,
    cakes: state.cakes,
    customer: state.customer,
    lastOrder: state.lastOrder,
    addPot: state.addPot,
    removePot: state.removePot,
    setCakeQuantity: state.setCakeQuantity,
    updateCustomer: state.updateCustomer,
    completeOrder: state.completeOrder,
    startNewOrder: state.startNewOrder,
    clearLastOrder: state.clearLastOrder,
  }))

  return {
    ...store,
    summary: calculateOrderSummary({ pots: store.pots, cakes: store.cakes }),
  }
}
