import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskMetrics = ({ metrics, onRiskLevelClick, activeFilters = [] }) => {
  const riskMetrics = [
    {
      level: 'critical',
      label: 'Critical',
      count: metrics?.criticalRisk || 0,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: 'AlertTriangle'
    },
    {
      level: 'high',
      label: 'High',
      count: metrics?.highRisk || 0,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: 'AlertCircle'
    },
    {
      level: 'medium',
      label: 'Medium',
      count: metrics?.mediumRisk || 0,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: 'Info'
    },
    {
      level: 'low',
      label: 'Low',
      count: metrics?.lowRisk || 0,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: 'CheckCircle'
    }
  ];

  const totalVulnerabilities = metrics?.totalVulnerabilities || riskMetrics.reduce((sum, metric) => sum + metric.count, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {riskMetrics.map((metric) => {
        const isActive = activeFilters.includes(metric.level);
        return (
          <button
            key={metric.level}
            onClick={() => onRiskLevelClick && onRiskLevelClick(metric.level)}
            className={`${metric.bgColor} ${metric.borderColor} border rounded-lg p-4 hover:shadow-elevation-2 transition-all duration-200 text-left group ${
              isActive ? 'ring-2 ring-primary shadow-elevation-2' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric.color} ${isActive ? 'scale-110' : ''} transition-transform`}>
                <Icon name={metric.icon} size={20} color="white" />
              </div>
              <div className="flex items-center space-x-1">
                {isActive && (
                  <Icon 
                    name="Filter" 
                    size={14} 
                    className="text-primary" 
                  />
                )}
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className={`${metric.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} 
                />
              </div>
            </div>
          
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${metric.textColor}`}>
              {metric.count}
            </p>
            <p className={`text-sm font-medium ${metric.textColor}`}>
              {metric.label} Risk
            </p>
            <p className="text-xs text-muted-foreground">
              {totalVulnerabilities > 0 
                ? `${((metric.count / totalVulnerabilities) * 100).toFixed(1)}% of total`
                : '0% of total'
              }
            </p>
          </div>
        </button>
        );
      })}
    </div>
  );
};

export default RiskMetrics;