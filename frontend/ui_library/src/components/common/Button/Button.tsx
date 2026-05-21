import React from 'react';
import './Button.css';
import { Spinner } from '../Spinner/Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...rest
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    loading ? 'btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading && <Spinner size="sm" />}
      {!loading && icon && iconPosition === 'left' && (
        <span className="btn__icon">{icon}</span>
      )}
      {children && <span className="btn__label">{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn__icon">{icon}</span>
      )}
    </button>
  );
};
