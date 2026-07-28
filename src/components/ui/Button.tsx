import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost'
    fullWidth?: boolean
  }
>

const variantClasses = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-400 focus-visible:outline-brand-300 shadow-glow disabled:bg-slate-700',
  secondary:
    'bg-white/10 text-slate-100 hover:bg-white/15 focus-visible:outline-brand-300 disabled:bg-white/5',
  ghost:
    'bg-transparent text-slate-200 hover:bg-white/10 focus-visible:outline-brand-300 disabled:text-slate-500',
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
