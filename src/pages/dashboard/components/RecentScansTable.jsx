import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentScansTable = ({ scans, onViewDetails }) => {
  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Scans</h3>
          <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
            New Scan
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Scan Date</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Target</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Hosts</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vulnerabilities</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Risk Level</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {scans.map((scan) => (
              <tr key={scan.id} className="hover:bg-muted/30 transition-micro">
                <td className="p-4">
                  <div className="text-sm text-foreground font-medium">
                    {formatDate(scan.date)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{scan.target}</div>
                  <div className="text-xs text-muted-foreground">{scan.scanType}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Server" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{scan.hostCount}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground font-medium">{scan.vulnerabilityCount}</div>
                  <div className="text-xs text-muted-foreground">
                    {scan.criticalCount} critical, {scan.highCount} high
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskBadgeColor(scan.riskLevel)}`}>
                    {scan.riskLevel}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      scan.status === 'Completed' ? 'bg-green-500' : 
                      scan.status === 'In Progress' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm text-foreground">{scan.status}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewDetails(scan.id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                    >
                      Export
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentScansTable;