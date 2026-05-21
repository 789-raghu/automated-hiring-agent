import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  id,
  className = '',
  ...rest
}) => {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper--full' : ''} ${className}`}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={`input-field ${error ? 'input-field--error' : ''}`}>
        {leadingIcon && <span className="input-icon input-icon--leading">{leadingIcon}</span>}
        <input
          id={inputId}
          className={`input-el ${leadingIcon ? 'input-el--leading' : ''} ${trailingIcon ? 'input-el--trailing' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        {trailingIcon && <span className="input-icon input-icon--trailing">{trailingIcon}</span>}
      </div>
      {error && (
        <p className="input-message input-message--error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="input-message" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  fullWidth = false,
  id,
  className = '',
  ...rest
}) => {
  const inputId = id ?? `textarea-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper--full' : ''} ${className}`}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`input-el input-el--textarea ${error ? 'input-el--error' : ''}`}
        aria-invalid={!!error}
        {...rest}
      />
      {error && (
        <p className="input-message input-message--error" role="alert">
          {error}
        </p>
      )}
      {!error && hint && <p className="input-message">{hint}</p>}
    </div>
  );
};
