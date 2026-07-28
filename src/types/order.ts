export type OrderType = 'pickup' | 'delivery'

export type PotToppingSelection = {
  id: string
  name: string
  price: number
}

export type PotCartItem = {
  id: string
  sizeId: string
  sizeLabel: string
  basePrice: number
  maxFlavors: number
  flavors: string[]
  toppings: PotToppingSelection[]
  note: string
}

export type CakeCartItem = {
  cakeId: string
  name: string
  price: number
  image: string
  quantity: number
}

export type CustomerDraft = {
  orderType: OrderType
  name: string
  phone: string
  street: string
  number: string
  crossStreets: string
  floor: string
  apartment: string
  observations: string
}

export type OrderDraft = {
  pots: PotCartItem[]
  cakes: CakeCartItem[]
  customer: CustomerDraft
}

export type LastOrder = {
  orderId: string
  customerName: string
  total: number
  orderType: OrderType
}
