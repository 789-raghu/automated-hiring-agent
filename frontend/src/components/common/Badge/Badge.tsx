import React from 'react';
import './Badge.css';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type ApplicationStatus =
  | 'new'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  dot = false,
  className = '',
}) => (
  <span className={`badge badge--${variant} ${className}`}>
    {dot && <span className="badge__dot" />}
    {children}
  </span>
);

const statusVariantMap: Record<ApplicationStatus, BadgeVariant> = {
  new: 'info',
  screening: 'primary',
  interview: 'warning',
  offer: 'success',
  hired: 'success',
  rejected: 'danger',
};

const statusLabelMap: Record<ApplicationStatus, string> = {
  new: 'New',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer Sent',
  hired: 'Hired',
  rejected: 'Rejected',
};

export const StatusBadge: React.FC<{ status: ApplicationStatus; className?: string }> = ({
  status,
  className = '',
}) => (
  <Badge variant={statusVariantMap[status]} dot className={className}>
    {statusLabelMap[status]}
  </Badge>
);
