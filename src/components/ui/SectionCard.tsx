import type { PropsWithChildren } from 'react'

type SectionCardProps = PropsWithChildren<{
  className?: string
}>

export const SectionCard = ({ children, className = '' }: SectionCardProps) => (
  <section
    className={`rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-md backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-2xl dark:shadow-slate-950/20 md:p-6 ${className}`}
  >
    {children}
  </section>
)
