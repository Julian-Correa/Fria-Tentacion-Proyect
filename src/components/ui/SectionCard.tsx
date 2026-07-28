import type { PropsWithChildren } from 'react'

type SectionCardProps = PropsWithChildren<{
  className?: string
}>

export const SectionCard = ({ children, className = '' }: SectionCardProps) => (
  <section
    className={`rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur md:p-6 ${className}`}
  >
    {children}
  </section>
)
