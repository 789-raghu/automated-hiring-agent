import React from 'react';
import './AgentStatus.css';
import { Spinner } from '../../common/Spinner/Spinner';

export type AgentState = 'idle' | 'thinking' | 'screening' | 'scoring' | 'done' | 'error';

export interface AgentLog {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AgentStatusProps {
  state: AgentState;
  currentTask?: string;
  progress?: number;
  logs?: AgentLog[];
  candidatesProcessed?: number;
  totalCandidates?: number;
  className?: string;
}

const stateConfig: Record<AgentState, { label: string; color: string }> = {
  idle: { label: 'Idle', color: 'var(--text)' },
  thinking: { label: 'Thinking…', color: 'var(--accent)' },
  screening: { label: 'Screening', color: '#2563eb' },
  scoring: { label: 'Scoring', color: '#d97706' },
  done: { label: 'Complete', color: '#16a34a' },
  error: { label: 'Error', color: '#dc2626' },
};

export const AgentStatus: React.FC<AgentStatusProps> = ({
  state,
  currentTask,
  progress,
  logs = [],
  candidatesProcessed,
  totalCandidates,
  className = '',
}) => {
  const { label, color } = stateConfig[state];
  const isActive = state === 'thinking' || state === 'screening' || state === 'scoring';

  return (
    <div className={`agent-status ${className}`}>
      <div className="agent-status__header">
        <div className="agent-status__indicator">
          {isActive ? (
            <Spinner size="sm" />
          ) : (
            <span
              className="agent-status__dot"
              style={{ background: color }}
            />
          )}
          <span className="agent-status__state" style={{ color }}>
            {label}
          </span>
        </div>
        {totalCandidates !== undefined && candidatesProcessed !== undefined && (
          <span className="agent-status__count">
            {candidatesProcessed} / {totalCandidates} candidates
          </span>
        )}
      </div>

      {currentTask && (
        <p className="agent-status__task">{currentTask}</p>
      )}

      {progress !== undefined && (
        <div className="agent-status__progress-track">
          <div
            className="agent-status__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {logs.length > 0 && (
        <div className="agent-status__logs">
          {logs.slice(-6).map((log) => (
            <div key={log.id} className={`agent-status__log agent-status__log--${log.type}`}>
              <LogDot type={log.type} />
              <span className="agent-status__log-msg">{log.message}</span>
              <span className="agent-status__log-time">{log.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LogDot: React.FC<{ type: AgentLog['type'] }> = ({ type }) => {
  const colors: Record<AgentLog['type'], string> = {
    info: '#2563eb',
    success: '#16a34a',
    warning: '#b45309',
    error: '#dc2626',
  };
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: colors[type],
        flexShrink: 0,
        display: 'inline-block',
        marginTop: 2,
      }}
    />
  );
};
