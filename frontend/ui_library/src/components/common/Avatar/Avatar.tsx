import React from 'react';
import './Avatar.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function colorFromName(name: string): string {
  const colors = [
    '#7c3aed', '#2563eb', '#0891b2', '#059669',
    '#d97706', '#dc2626', '#be185d', '#4f46e5',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);
  const showImage = src && !imgError;

  return (
    <span
      className={`avatar avatar--${size} ${className}`}
      style={!showImage ? { background: colorFromName(name) } : undefined}
      aria-label={name}
    >
      {showImage ? (
        <img src={src} alt={name} onError={() => setImgError(true)} />
      ) : (
        <span className="avatar__initials">{getInitials(name)}</span>
      )}
    </span>
  );
};

export interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarSize;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'sm',
}) => {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div className="avatar-group">
      {visible.map((a, i) => (
        <Avatar key={i} {...a} size={size} />
      ))}
      {overflow > 0 && (
        <span className={`avatar avatar--${size} avatar--overflow`}>+{overflow}</span>
      )}
    </div>
  );
};
