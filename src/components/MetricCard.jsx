import React from 'react';

export const MetricCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeType = 'positive', // positive, warning, neutral
  progressValue,
  accentColor = '#6D5CE8',
  onClick,
}) => {
  return (
    <div
      className="kpi-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        {Icon && (
          <div
            className="kpi-icon-wrap"
            style={{
              backgroundColor: `${accentColor}14`,
              color: accentColor,
              border: `1px solid ${accentColor}26`,
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="kpi-value-row">
        <span className="kpi-value">{value}</span>
        {badgeText && (
          <span className={`kpi-badge ${badgeType}`}>{badgeText}</span>
        )}
      </div>

      {subtext && <div className="kpi-sub">{subtext}</div>}

      {progressValue !== undefined && (
        <div className="kpi-progress">
          <div
            className="kpi-progress-bar"
            style={{
              width: `${Math.min(100, Math.max(0, progressValue))}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      )}
    </div>
  );
};
