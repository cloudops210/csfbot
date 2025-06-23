import { ButtonHTMLAttributes } from 'react';
import clsx from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-6 py-3 rounded-lg font-semibold transition-all',
        variant === 'primary'
          ? 'bg-black text-white shadow-subtle hover:shadow-strong'
          : 'bg-secondary text-black border border-border',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
} 