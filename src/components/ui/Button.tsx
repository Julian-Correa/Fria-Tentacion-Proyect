import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost'
    fullWidth?: boolean
  }
>

const variantClasses = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-400 focus-visible:outline-brand-300 shadow-glow disabled:bg-slate-300 dark:disabled:bg-slate-700',
  secondary:
    'bg-slate-200 text-slate-800 hover:bg-slate-300 focus-visible:outline-brand-300 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15 dark:disabled:bg-white/5',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-brand-300 dark:text-slate-200 dark:hover:bg-white/10 disabled:text-slate-400 dark:disabled:text-slate-500',
}

export const Button = ({
  children,
  className = '',
  fullWidth = false,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    {...props}
  >
    {children}
  </button>
)
