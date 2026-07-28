import type { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form'

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
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Tus datos</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Completa lo necesario para confirmar el pedido.</p>
      </div>

      <input type="hidden" {...register('orderType')} />

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
            <div className="rounded-3xl border border-brand-400/20 bg-brand-500/10 p-4 text-sm text-brand-100 md:col-span-2">
              {appConfig.store.deliveryNote}
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
