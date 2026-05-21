import React from 'react';
import './SearchBar.css';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  fullWidth?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search…',
  onClear,
  fullWidth = false,
  className = '',
}) => (
  <div className={`search-bar ${fullWidth ? 'search-bar--full' : ''} ${className}`}>
    <span className="search-bar__icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </span>
    <input
      type="search"
      className="search-bar__input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
    />
    {value && onClear && (
      <button className="search-bar__clear" onClick={onClear} aria-label="Clear search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    )}
  </div>
);
