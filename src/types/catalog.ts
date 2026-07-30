export type BusinessData = {
  brand: {
    name: string
    tagline: string
    description: string
  }
  store: {
    city: string
    pickupLabel: string
    pickupNote: string
    deliveryNote: string
  }
  contact: {
    whatsappNumber: string
  }
  currency: {
    code: string
    locale: string
    symbol: string
  }
  language: string
  rules: {
    maxToppingsPerPot: number
  }
  featureFlags: {
    darkMode: boolean
    cakes: boolean
    delivery: boolean
    pickup: boolean
    motion: boolean
  }
  messages: {
    pendingConfirmation: string
    deliveryPending: string
  }
}

export type SizeOption = {
  id: string
  label: string
  price: number
  maxFlavors: number
}

export type Flavor = {
  id: string
  name: string
  category: string
}

export type Topping = {
  id: string
  name: string
  price: number
}

export type Cake = {
  id: string
  name: string
  description: string
  price: number
  image: string
}
