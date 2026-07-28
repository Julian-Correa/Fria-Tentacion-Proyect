import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type FieldProps = {
  label: string
  error?: string
}

type InputProps = FieldProps & InputHTMLAttributes<HTMLInputElement>
type TextareaProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>

const baseClasses =
  'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50 dark:placeholder:text-slate-500'

export const InputField = ({ label, error, className = '', ...props }: InputProps) => (
  <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
    <span>{label}</span>
    <input className={`${baseClasses} ${className}`} {...props} />
    {error ? <span className="text-xs text-rose-500 dark:text-rose-300">{error}</span> : null}
  </label>
)

export const TextareaField = ({ label, error, className = '', ...props }: TextareaProps) => (
  <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
    <span>{label}</span>
    <textarea className={`${baseClasses} min-h-28 resize-none ${className}`} {...props} />
    {error ? <span className="text-xs text-rose-500 dark:text-rose-300">{error}</span> : null}
  </label>
)
