import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, ReactNode } from 'react';

const inputBase =
  'w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={`${inputBase} ${className}`} {...props} />
  )
);
Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = '', ...props }, ref) => (
  <textarea ref={ref} className={`${inputBase} resize-none ${className}`} {...props} />
));
Textarea.displayName = 'Textarea';

interface LabelProps {
  children: ReactNode;
  className?: string;
  suffix?: string;
}

export function Label({ children, className = '', suffix }: LabelProps) {
  return (
    <label className={`text-sm font-medium text-zinc-300 flex items-center gap-2 ${className}`}>
      {children}
      {suffix !== undefined && (
        <span className="text-xs text-zinc-600 font-normal">{suffix}</span>
      )}
    </label>
  );
}
