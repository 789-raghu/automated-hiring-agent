import React from 'react';
import './Tabs.css';

export interface Tab {
  key: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeKey,
  onChange,
  className = '',
}) => (
  <div className={`tabs ${className}`} role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        role="tab"
        aria-selected={tab.key === activeKey}
        disabled={tab.disabled}
        className={`tabs__tab ${tab.key === activeKey ? 'tabs__tab--active' : ''}`}
        onClick={() => onChange(tab.key)}
      >
        {tab.icon && <span className="tabs__tab-icon">{tab.icon}</span>}
        <span>{tab.label}</span>
        {tab.count !== undefined && (
          <span className="tabs__count">{tab.count}</span>
        )}
      </button>
    ))}
  </div>
);
