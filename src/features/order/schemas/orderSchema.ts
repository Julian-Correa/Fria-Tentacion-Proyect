import { z } from 'zod'

export const customerSchema = z.discriminatedUnion('orderType', [
  z.object({
    orderType: z.literal('pickup'),
    name: z.string().trim().min(1, 'Ingresa tu nombre.'),
    phone: z.string().trim(),
    street: z.string().trim(),
    number: z.string().trim(),
    crossStreets: z.string().trim(),
    floor: z.string().trim(),
    apartment: z.string().trim(),
    observations: z.string().trim(),
  }),
  z.object({
    orderType: z.literal('delivery'),
    name: z.string().trim().min(1, 'Ingresa tu nombre.'),
    phone: z.string().trim().min(6, 'Ingresa un telefono valido.'),
    street: z.string().trim().min(1, 'Ingresa la calle.'),
    number: z.string().trim().min(1, 'Ingresa la altura.'),
    crossStreets: z.string().trim().min(1, 'Ingresa las entrecalles.'),
    floor: z.string().trim(),
    apartment: z.string().trim(),
    observations: z.string().trim(),
  }),
])

const potSchema = (maxToppingsPerPot: number) =>
  z
    .object({
      id: z.string().min(1),
      sizeId: z.string().min(1),
      sizeLabel: z.string().min(1),
      basePrice: z.number().positive(),
      maxFlavors: z.number().int().positive(),
      flavors: z.array(z.string().trim().min(1)).min(1, 'Selecciona al menos un sabor.'),
      toppings: z
        .array(
          z.object({
            id: z.string().min(1),
            name: z.string().min(1),
            price: z.number().nonnegative(),
          }),
        )
        .max(maxToppingsPerPot, `Puedes elegir hasta ${maxToppingsPerPot} toppings.`),
      note: z.string(),
    })
    .superRefine((pot, context) => {
      if (pot.flavors.length > pot.maxFlavors) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['flavors'],
          message: `El tamano ${pot.sizeLabel} permite hasta ${pot.maxFlavors} sabores.`,
        })
      }

      if (new Set(pot.flavors).size !== pot.flavors.length) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['flavors'],
          message: 'No puedes repetir sabores en el mismo pote.',
        })
      }
    })

const cakeSchema = z.object({
  cakeId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  image: z.string().min(1),
  quantity: z.number().int().positive(),
})

export const buildOrderSchema = (maxToppingsPerPot: number) =>
  z
    .object({
      pots: z.array(potSchema(maxToppingsPerPot)),
      cakes: z.array(cakeSchema),
      customer: customerSchema,
    })
    .superRefine((order, context) => {
      if (order.pots.length === 0 && order.cakes.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pots'],
          message: 'Agrega al menos un producto antes de confirmar.',
        })
      }
    })
