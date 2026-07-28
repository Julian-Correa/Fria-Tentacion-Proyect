import { catalog } from '@/services/catalog'

export const appConfig = {
  appName: catalog.business.brand.name,
  language: catalog.business.language,
  currency: catalog.business.currency.code,
  locale: catalog.business.currency.locale,
  currencySymbol: catalog.business.currency.symbol,
  whatsappNumber: catalog.business.contact.whatsappNumber,
  store: catalog.business.store,
  messages: catalog.business.messages,
  rules: catalog.business.rules,
  featureFlags: catalog.business.featureFlags,
  storageKeys: {
    order: 'fria-tentacion-order',
    theme: 'fria-tentacion-theme',
  },
} as const
