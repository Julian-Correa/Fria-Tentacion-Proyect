import { Navigate, Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { AppShell } from '@/layouts/AppShell'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrderPage } from '@/pages/OrderPage'
import { SuccessPage } from '@/pages/SuccessPage'

const App = () => (
  <AppShell>
    <Routes>
      <Route path={ROUTES.home} element={<Navigate to={ROUTES.order} replace />} />
      <Route path={ROUTES.order} element={<OrderPage />} />
      <Route path={ROUTES.success} element={<SuccessPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </AppShell>
)

export default App
