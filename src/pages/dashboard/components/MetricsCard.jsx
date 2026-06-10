import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, icon, color, trend, trendValue, description }) => {
  const getColorClasses = (colorType) => {
    switch (colorType) {
      case 'critical':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'success':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'info':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up' && color === 'critical') return 'text-red-500';
    if (trend === 'up' && color === 'success') return 'text-green-500';
    if (trend === 'down' && color === 'critical') return 'text-green-500';
    if (trend === 'down' && color === 'success') return 'text-red-500';
    return 'text-slate-500';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-standard">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg border ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;