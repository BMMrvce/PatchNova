import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ReportHistory = ({ reports = [], isLoading = false, onViewReport, onRegenerateReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-blue-600 bg-blue-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filtered = reports
    .filter(r => {
      const filename = r.file_upload_logs?.file_name ?? '';
      return filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.scan_status || '').toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const aDate = new Date(a.created_at);
      const bDate = new Date(b.created_at);
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading scan results...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="History" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Scan History</h2>
            <span className="text-sm text-muted-foreground">
              ({filtered.length} {filtered.length === 1 ? 'scan' : 'scans'})
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
          >
            <Icon
              name={sortOrder === 'desc' ? 'ArrowDownNarrowWide' : 'ArrowUpNarrowWide'}
              size={16}
              className="mr-1"
            />
            {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
          </Button>
        </div>

        <div className="max-w-md">
          <Input
            type="search"
            placeholder="Search by file name or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-4 font-medium text-foreground text-sm">File</th>
                <th className="text-left p-4 font-medium text-foreground text-sm">Date</th>
                <th className="text-left p-4 font-medium text-foreground text-sm">Vulnerabilities</th>
                <th className="text-left p-4 font-medium text-foreground text-sm">Risk Breakdown</th>
                <th className="text-left p-4 font-medium text-foreground text-sm">Status</th>
                <th className="text-right p-4 font-medium text-foreground text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((scan) => {
                const data = scan.scan_data || {};
                const critical = data.criticalRisk ?? 0;
                const high = data.highRisk ?? scan.high_risk_count ?? 0;
                const medium = data.mediumRisk ?? scan.medium_risk_count ?? 0;
                const low = data.lowRisk ?? scan.low_risk_count ?? 0;
                const total = data.totalVulnerabilities ?? scan.vulnerabilities_found ?? 0;
                const filename = scan.file_upload_logs?.file_name ?? 'Unknown file';
                const hosts = data.hostsScanned ?? 0;

                return (
                  <tr key={scan.id} className="border-t border-border hover:bg-muted/20 transition-micro">
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="FileCode" size={16} className="text-muted-foreground flex-shrink-0" />
                        <div>
                          <div className="font-medium text-foreground text-sm">{filename}</div>
                          {hosts > 0 && (
                            <div className="text-xs text-muted-foreground">{hosts} {hosts === 1 ? 'host' : 'hosts'} scanned</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-foreground">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-lg font-bold text-foreground">{total}</div>
                      <div className="text-xs text-muted-foreground">total found</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        {critical > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium text-red-600 bg-red-50">
                            {critical} critical
                          </span>
                        )}
                        {high > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium text-orange-600 bg-orange-50">
                            {high} high
                          </span>
                        )}
                        {medium > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium text-yellow-600 bg-yellow-50">
                            {medium} medium
                          </span>
                        )}
                        {low > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-50">
                            {low} low
                          </span>
                        )}
                        {total === 0 && (
                          <span className="text-xs text-muted-foreground">No vulnerabilities</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scan.scan_status)}`}>
                        {scan.scan_status ?? 'unknown'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewReport(scan)}
                          iconName="Eye"
                          title="View Report"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRegenerateReport(scan.id)}
                          iconName="RefreshCw"
                          title="Regenerate"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <Icon name="FileSearch" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? 'No scans match your search' : 'No scans yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? 'Try a different search term'
              : 'Upload an Nmap XML file to run your first scan and see results here'}
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
              iconName="X"
              iconPosition="left"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportHistory;
