import React from 'react';
import './Card.css';

export interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  selected?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  hoverable = false,
  selected = false,
  padding = 'md',
  className = '',
  style,
}) => (
  <div
    className={[
      'card',
      `card--pad-${padding}`,
      hoverable || onClick ? 'card--hoverable' : '',
      selected ? 'card--selected' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    style={style}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`card__header ${className}`}>{children}</div>;

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`card__body ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`card__footer ${className}`}>{children}</div>;
