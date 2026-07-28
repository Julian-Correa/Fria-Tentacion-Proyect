export const generateOrderId = () => crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
