import type { CakeCartItem, OrderDraft, PotCartItem } from '@/types/order'

export const getPotTotal = (pot: PotCartItem) =>
  pot.basePrice + pot.toppings.reduce((total, topping) => total + topping.price, 0)

export const getCakeTotal = (cake: CakeCartItem) => cake.price * cake.quantity

export const calculateOrderSummary = (order: Pick<OrderDraft, 'pots' | 'cakes'>) => {
  const potsSubtotal = order.pots.reduce((total, pot) => total + getPotTotal(pot), 0)
  const cakesSubtotal = order.cakes.reduce((total, cake) => total + getCakeTotal(cake), 0)
  const subtotal = potsSubtotal + cakesSubtotal

  return {
    potsSubtotal,
    cakesSubtotal,
    subtotal,
    total: subtotal,
    itemsCount: order.pots.length + order.cakes.reduce((total, cake) => total + cake.quantity, 0),
  }
}
