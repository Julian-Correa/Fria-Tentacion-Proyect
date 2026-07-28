import type { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form'
import { Bike, Store } from 'lucide-react'

import { InputField, TextareaField } from '@/components/ui/Field'
import { SectionCard } from '@/components/ui/SectionCard'
import { appConfig } from '@/config/app'
import type { CustomerDraft } from '@/types/order'

type CheckoutFormProps = {
  register: UseFormRegister<CustomerDraft>
  watch: UseFormWatch<CustomerDraft>
  errors: FieldErrors<CustomerDraft>
}

export const CheckoutForm = ({ register, watch, errors }: CheckoutFormProps) => {
  const orderType = watch('orderType')

  return (
    <SectionCard className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Tus datos</h2>
        <p className="text-sm text-slate-300">Completa lo necesario para confirmar el pedido.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="cursor-pointer rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-200 transition has-[:checked]:border-brand-300 has-[:checked]:bg-brand-400/15">
          <input type="radio" value="pickup" className="sr-only" {...register('orderType')} />
          <div className="flex items-center gap-3">
            <Store className="size-5 text-brand-200" />
            <div>
              <p className="font-semibold text-white">Retiro</p>
              <p className="text-xs text-slate-400">{appConfig.store.pickupNote}</p>
            </div>
          </div>
        </label>

        <label className="cursor-pointer rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-200 transition has-[:checked]:border-brand-300 has-[:checked]:bg-brand-400/15">
          <input type="radio" value="delivery" className="sr-only" {...register('orderType')} />
          <div className="flex items-center gap-3">
            <Bike className="size-5 text-brand-200" />
            <div>
              <p className="font-semibold text-white">Delivery</p>
              <p className="text-xs text-slate-400">{appConfig.store.deliveryNote}</p>
            </div>
          </div>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Nombre"
          placeholder="Tu nombre"
          error={errors.name?.message}
          {...register('name')}
        />

        <InputField
          label={orderType === 'delivery' ? 'Telefono' : 'Telefono (opcional)'}
          placeholder="11 1234 5678"
          error={errors.phone?.message}
          {...register('phone')}
        />

        {orderType === 'delivery' ? (
          <>
            <InputField
              label="Calle"
              placeholder="Ejemplo: Av. Corrientes"
              error={errors.street?.message}
              {...register('street')}
            />
            <InputField
              label="Numero"
              placeholder="1234"
              error={errors.number?.message}
              {...register('number')}
            />
            <InputField
              label="Entrecalles"
              placeholder="Entre X y Y"
              error={errors.crossStreets?.message}
              {...register('crossStreets')}
            />
            <InputField
              label="Piso (opcional)"
              placeholder="Ejemplo: 4"
              error={errors.floor?.message}
              {...register('floor')}
            />
            <InputField
              label="Departamento (opcional)"
              placeholder="Ejemplo: B"
              error={errors.apartment?.message}
              {...register('apartment')}
            />
            <div className="rounded-3xl border border-amber-300/20 bg-amber-500/10 p-4 text-sm text-amber-100 md:col-span-2">
              TODO de negocio: el radio y el horario exactos de entrega aun no estan definidos.
            </div>
          </>
        ) : null}

        <div className="md:col-span-2">
          <TextareaField
            label="Observaciones (opcional)"
            placeholder="Aclaraciones generales para el pedido"
            error={errors.observations?.message}
            {...register('observations')}
          />
        </div>
      </div>
    </SectionCard>
  )
}
