import React from 'react';

import Icon from '../../../components/AppIcon';

const QuickActionsPanel = ({ onUploadScan, onViewCritical, onGenerateReport, onAIAnalysis }) => {
  const quickActions = [
    {
      id: 'upload',
      title: 'Upload New Scan',
      description: 'Upload Nmap XML files for analysis',
      icon: 'Upload',
      color: 'primary',
      onClick: onUploadScan
    },
    {
      id: 'critical',
      title: 'View Critical Issues',
      description: 'Review high-priority vulnerabilities',
      icon: 'AlertTriangle',
      color: 'destructive',
      onClick: onViewCritical
    },
    {
      id: 'report',
      title: 'Generate Report',
      description: 'Create comprehensive security report',
      icon: 'FileText',
      color: 'secondary',
      onClick: onGenerateReport
    },
    {
      id: 'ai',
      title: 'AI Analysis',
      description: 'Get AI-powered recommendations',
      icon: 'MessageSquare',
      color: 'accent',
      onClick: onAIAnalysis
    }
  ];

  const getButtonVariant = (color) => {
    switch (color) {
      case 'primary':
        return 'default';
      case 'destructive':
        return 'destructive';
      case 'secondary':
        return 'secondary';
      case 'accent':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <div
            key={action.id}
            className="p-4 border border-border rounded-lg hover:shadow-elevation-1 transition-standard cursor-pointer group"
            onClick={action.onClick}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                action.color === 'primary' ? 'bg-primary/10 text-primary' :
                action.color === 'destructive' ? 'bg-red-50 text-red-600' :
                action.color === 'secondary'? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
              }`}>
                <Icon name={action.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-micro">
                  {action.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {action.description}
                </p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-micro" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;