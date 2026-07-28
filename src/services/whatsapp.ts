import { appConfig } from '@/config/app'
import { formatCurrency } from '@/utils/formatCurrency'
import { calculateOrderSummary, getPotTotal } from '@/utils/orderCalculations'
import type { OrderDraft } from '@/types/order'

type BuildWhatsappMessageParams = {
  orderId: string
  order: OrderDraft
}

const formatAddress = (order: OrderDraft) => {
  if (order.customer.orderType === 'pickup') {
    return appConfig.store.pickupLabel
  }

  const optionalLines = [
    order.customer.floor ? `Piso: ${order.customer.floor}` : '',
    order.customer.apartment ? `Departamento: ${order.customer.apartment}` : '',
  ].filter(Boolean)

  return [
    `${order.customer.street} ${order.customer.number}`,
    `Entre calles: ${order.customer.crossStreets}`,
    ...optionalLines,
  ].join('\n')
}

export const buildWhatsappMessage = ({ orderId, order }: BuildWhatsappMessageParams) => {
  const summary = calculateOrderSummary(order)
  const lines: string[] = [
    'Nuevo Pedido',
    '',
    'Pedido:',
    orderId,
    '',
    'Tipo:',
    order.customer.orderType === 'pickup' ? 'Retiro' : 'Delivery',
    '',
    'Cliente:',
    order.customer.name,
  ]

  if (order.customer.phone) {
    lines.push('', 'Telefono:', order.customer.phone)
  }

  lines.push('', order.customer.orderType === 'pickup' ? 'Retiro:' : 'Direccion:', formatAddress(order))

  if (order.pots.length > 0) {
    lines.push('', 'Productos')

    order.pots.forEach((pot) => {
      lines.push('', `${pot.sizeLabel} - ${formatCurrency(getPotTotal(pot))}`)
      pot.flavors.forEach((flavor) => lines.push(`- ${flavor}`))

      if (pot.toppings.length > 0) {
        lines.push('Toppings')
        pot.toppings.forEach((topping) => lines.push(`- ${topping.name}`))
      }

      if (pot.note) {
        lines.push('Nota del pote:', pot.note)
      }
    })
  }

  if (order.cakes.length > 0) {
    lines.push('', 'Tortas')
    order.cakes.forEach((cake) => lines.push(`- ${cake.name} x${cake.quantity}`))
  }

  lines.push('', 'Total', formatCurrency(summary.total))

  if (order.customer.observations) {
    lines.push('', 'Observaciones:', order.customer.observations)
  }

  if (order.customer.orderType === 'delivery') {
    lines.push('', appConfig.messages.deliveryPending)
  }

  return lines.join('\n')
}

export const buildWhatsappUrl = (message: string) =>
  `https://wa.me/${appConfig.whatsappNumber}?text=${encodeURIComponent(message)}`

export const openWhatsappWindow = (message: string) => {
  const url = buildWhatsappUrl(message)

  try {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    anchor.click()

    return true
  } catch (error) {
    console.error('No se pudo abrir WhatsApp', error)
    return false
  }
}
