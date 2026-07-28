import { z } from 'zod'

import businessData from '@/data/business.json'
import cakesData from '@/data/cakes.json'
import flavorsData from '@/data/flavors.json'
import pricesData from '@/data/prices.json'
import sizesData from '@/data/sizes.json'
import toppingsData from '@/data/toppings.json'
import type { BusinessData, Cake, Flavor, SizeOption, Topping } from '@/types/catalog'

const businessSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1),
  }),
  store: z.object({
    city: z.string().min(1),
    pickupLabel: z.string().min(1),
    pickupNote: z.string().min(1),
    deliveryNote: z.string().min(1),
  }),
  contact: z.object({
    whatsappNumber: z.string().min(8),
  }),
  currency: z.object({
    code: z.string().min(1),
    locale: z.string().min(1),
    symbol: z.string().min(1),
  }),
  language: z.string().min(1),
  rules: z.object({
    maxToppingsPerPot: z.number().int().positive(),
  }),
  featureFlags: z.object({
    darkMode: z.boolean(),
    cakes: z.boolean(),
    delivery: z.boolean(),
    pickup: z.boolean(),
    motion: z.boolean(),
  }),
  messages: z.object({
    pendingConfirmation: z.string().min(1),
    deliveryPending: z.string().min(1),
  }),
})

const sizeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
})

const priceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  maxFlavors: z.number().int().positive(),
})

const flavorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
})

const toppingSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
})

const cakeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  image: z.string().min(1),
})

const buildSizesCatalog = () => {
  const sizes = z.array(sizeSchema).parse(sizesData)
  const prices = z.array(priceSchema).parse(pricesData)
  const pricesById = new Map(prices.map((price) => [price.id, price]))

  return sizes.map((size) => {
    const priceConfig = pricesById.get(size.id)

    if (!priceConfig) {
      throw new Error(`No se encontro configuracion de precio para el tamano ${size.id}`)
    }

    return {
      id: size.id,
      label: size.label || priceConfig.name,
      price: priceConfig.price,
      maxFlavors: priceConfig.maxFlavors,
    }
  })
}

export const catalog: {
  business: BusinessData
  sizes: SizeOption[]
  flavors: Flavor[]
  toppings: Topping[]
  cakes: Cake[]
} = {
  business: businessSchema.parse(businessData),
  sizes: buildSizesCatalog(),
  flavors: z.array(flavorSchema).parse(flavorsData),
  toppings: z.array(toppingSchema).parse(toppingsData),
  cakes: z.array(cakeSchema).parse(cakesData),
}
