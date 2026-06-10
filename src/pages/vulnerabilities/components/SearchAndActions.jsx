import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchAndActions = ({ searchTerm, onSearchChange, onBulkAction, selectedCount, scanStats }) => {
  const handleExportAll = () => {
    onBulkAction('export-all');
  };

  const handleRefreshScan = () => {
    onBulkAction('refresh-scan');
  };

  const handleGenerateReport = () => {
    onBulkAction('generate-report');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="text"
              placeholder="Search vulnerabilities, services, or CVE IDs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshScan}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Refresh Scan
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              iconName="Download"
              iconPosition="left"
            >
              Export All
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleGenerateReport}
              iconName="FileText"
              iconPosition="left"
            >
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} />
            <span>{scanStats?.totalVulnerabilities ?? 0} Total Vulnerabilities</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} />
            <span>
              {scanStats?.lastScanDate
                ? `Last scan: ${new Date(scanStats.lastScanDate).toLocaleDateString()}`
                : 'No scans yet'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Server" size={16} />
            <span>{scanStats?.affectedSystems ?? 0} Affected Systems</span>
          </div>
        </div>
        
        {selectedCount > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="CheckSquare" size={16} className="text-primary" />
            <span className="text-primary font-medium">{selectedCount} selected</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndActions;