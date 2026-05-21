import React from 'react';
import './Spinner.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label = 'Loading…',
}) => (
  <span
    className={`spinner spinner--${size}`}
    role="status"
    aria-label={label}
  >
    <span className="spinner__ring" />
  </span>
);
