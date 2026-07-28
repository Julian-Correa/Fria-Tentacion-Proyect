import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type FieldProps = {
  label: string
  error?: string
}

type InputProps = FieldProps & InputHTMLAttributes<HTMLInputElement>
type TextareaProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>

const baseClasses =
  'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-brand-400'

export const InputField = ({ label, error, className = '', ...props }: InputProps) => (
  <label className="flex flex-col gap-2 text-sm text-slate-200">
    <span>{label}</span>
    <input className={`${baseClasses} ${className}`} {...props} />
    {error ? <span className="text-xs text-rose-300">{error}</span> : null}
  </label>
)

export const TextareaField = ({ label, error, className = '', ...props }: TextareaProps) => (
  <label className="flex flex-col gap-2 text-sm text-slate-200">
    <span>{label}</span>
    <textarea className={`${baseClasses} min-h-28 resize-none ${className}`} {...props} />
    {error ? <span className="text-xs text-rose-300">{error}</span> : null}
  </label>
)
