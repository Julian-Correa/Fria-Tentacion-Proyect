import { motion } from 'framer-motion'
import { ArrowRight, CakeSlice, IceCreamCone, MessageCircleMore, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { SectionCard } from '@/components/ui/SectionCard'
import { ROUTES } from '@/constants/routes'
import { catalog } from '@/services/catalog'

const steps = [
  {
    title: 'Elige tus sabores',
    description: 'Potes configurables con limites claros de sabores y toppings.',
    icon: IceCreamCone,
  },
  {
    title: 'Suma tortas si quieres',
    description: 'Catalogo editable desde JSON para mantenimiento simple del negocio.',
    icon: CakeSlice,
  },
  {
    title: 'Confirma por WhatsApp',
    description: 'Sin registros, sin backend y con resumen listo para enviar.',
    icon: MessageCircleMore,
  },
]

export const HomePage = () => (
  <div className="space-y-6">
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-5 rounded-[32px] border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur md:p-8"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-brand-200">Helado artesanal premium</p>
        <div className="space-y-4">
          <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-white md:text-5xl">
            {catalog.business.brand.tagline}
          </h2>
          <p className="max-w-2xl text-base text-slate-300 md:text-lg">
            {catalog.business.brand.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to={ROUTES.order}>
            <Button className="w-full gap-2 sm:w-auto">
              Empezar pedido
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <a href="#como-funciona" className="sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              Ver como funciona
            </Button>
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-semibold text-white">{catalog.sizes.length}</p>
            <p className="text-sm text-slate-400">Tamanos de pote</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-semibold text-white">{catalog.flavors.length}</p>
            <p className="text-sm text-slate-400">Sabores disponibles</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-semibold text-white">{catalog.cakes.length}</p>
            <p className="text-sm text-slate-400">Tortas destacadas</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60 shadow-2xl shadow-slate-950/20"
      >
        <img
          src="/images/hero-helado.svg"
          alt="Ilustracion de helado artesanal"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </section>

    <section id="como-funciona" className="grid gap-4 lg:grid-cols-3">
      {steps.map((step, index) => {
        const Icon = step.icon

        return (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
          >
            <SectionCard className="h-full space-y-4">
              <div className="inline-flex rounded-2xl bg-brand-500/20 p-3 text-brand-200">
                <Icon className="size-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-sm text-slate-300">{step.description}</p>
            </SectionCard>
          </motion.div>
        )
      })}
    </section>

    <SectionCard className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          <ShieldCheck className="size-4" />
          Flujo simple y validado
        </div>
        <h3 className="text-2xl font-semibold text-white">Resumen en vivo, reglas claras y pedido listo para enviar</h3>
        <p className="text-sm text-slate-300">
          La app valida productos y datos obligatorios antes de abrir WhatsApp, sin perder el carrito al refrescar.
        </p>
      </div>

      <Link to={ROUTES.order}>
        <Button>Ir al pedido</Button>
      </Link>
    </SectionCard>
  </div>
)
