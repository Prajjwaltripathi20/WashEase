import React from 'react';
import clsx from 'clsx';

/**
 * Button
 * Props:
 * - variant: 'primary' | 'secondary' | 'ghost'
 * - size: 'md' | 'lg'
 * - className
 */
const Button = ({ variant = 'primary', size = 'md', children, className, ...props }) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all';
  const sizes = {
    md: 'px-6 py-3 text-sm h-[48px]',
    lg: 'px-8 py-3 text-base h-[52px]'
  };

  const variants = {
    primary: 'bg-gradient-to-r from-teal-400 to-violet-500 text-white shadow-wash-xl hover:scale-102 ring-1 ring-teal-400/20',
    secondary: 'bg-transparent border border-white/10 text-white/80 hover:bg-white/2',
    ghost: 'bg-transparent text-white/70 hover:text-white'
  };

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
