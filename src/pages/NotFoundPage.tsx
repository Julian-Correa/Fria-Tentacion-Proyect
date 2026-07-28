import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { SectionCard } from '@/components/ui/SectionCard'
import { ROUTES } from '@/constants/routes'

export const NotFoundPage = () => (
  <div className="mx-auto max-w-2xl">
    <SectionCard className="space-y-4 text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-brand-200">404</p>
      <h2 className="text-3xl font-semibold text-white">La pagina que buscas no existe</h2>
      <p className="text-sm text-slate-300">Vuelve al inicio o continua con tu pedido.</p>
      <div className="flex justify-center gap-3">
        <Link to={ROUTES.home}>
          <Button variant="secondary">Inicio</Button>
        </Link>
        <Link to={ROUTES.order}>
          <Button>Pedido</Button>
        </Link>
      </div>
    </SectionCard>
  </div>
)
