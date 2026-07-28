import { appConfig } from '@/config/app'

const formatter = new Intl.NumberFormat(appConfig.locale, {
  style: 'currency',
  currency: appConfig.currency,
  maximumFractionDigits: 0,
})

export const formatCurrency = (value: number) => formatter.format(value)
