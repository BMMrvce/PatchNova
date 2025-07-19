import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ReportHistory = ({ onRegenerateReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const reportHistory = [
    {
      id: 'rpt-001',
      name: 'Executive Summary - Production Network',
      type: 'Executive Summary',
      scanDate: '2025-07-10',
      generatedDate: '2025-07-11',
      generatedBy: 'John Smith',
      status: 'Completed',
      fileSize: '2.4 MB',
      downloadCount: 12,
      tags: ['Production', 'Critical']
    },
    {
      id: 'rpt-002',
      name: 'Technical Details - DMZ Infrastructure',
      type: 'Technical Details',
      scanDate: '2025-07-09',
      generatedDate: '2025-07-10',
      generatedBy: 'Sarah Johnson',
      status: 'Completed',
      fileSize: '5.8 MB',
      downloadCount: 8,
      tags: ['DMZ', 'Infrastructure']
    },
    {
      id: 'rpt-003',
      name: 'Compliance Report - SOC 2 Audit',
      type: 'Compliance',
      scanDate: '2025-07-08',
      generatedDate: '2025-07-09',
      generatedBy: 'Mike Davis',
      status: 'Completed',
      fileSize: '3.2 MB',
      downloadCount: 15,
      tags: ['SOC2', 'Compliance']
    },
    {
      id: 'rpt-004',
      name: 'Executive Summary - Web Applications',
      type: 'Executive Summary',
      scanDate: '2025-07-07',
      generatedDate: '2025-07-08',
      generatedBy: 'Lisa Chen',
      status: 'Completed',
      fileSize: '1.9 MB',
      downloadCount: 6,
      tags: ['WebApp', 'Security']
    },
    {
      id: 'rpt-005',
      name: 'Technical Details - Internal Network',
      type: 'Technical Details',
      scanDate: '2025-07-06',
      generatedDate: '2025-07-07',
      generatedBy: 'John Smith',
      status: 'Archived',
      fileSize: '4.1 MB',
      downloadCount: 3,
      tags: ['Internal', 'Network']
    }
  ];

  const filteredReports = reportHistory.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedReports = [...filteredReports].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'date':
        aValue = new Date(a.generatedDate);
        bValue = new Date(b.generatedDate);
        break;
      case 'size':
        aValue = parseFloat(a.fileSize);
        bValue = parseFloat(b.fileSize);
        break;
      default:
        aValue = a.generatedDate;
        bValue = b.generatedDate;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDownload = (reportId) => {
    // Simulate download
    console.log(`Downloading report: ${reportId}`);
  };

  const handlePreview = (reportId) => {
    // Simulate preview
    console.log(`Previewing report: ${reportId}`);
  };

  const handleRegenerate = (reportId) => {
    onRegenerateReport(reportId);
  };

  const handleDelete = (reportId) => {
    // Simulate delete
    console.log(`Deleting report: ${reportId}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'generating': return 'text-blue-600 bg-blue-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'archived': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'executive summary': return 'text-blue-600 bg-blue-50';
      case 'technical details': return 'text-purple-600 bg-purple-50';
      case 'compliance': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="History" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Report History</h2>
            <span className="text-sm text-muted-foreground">
              ({filteredReports.length} reports)
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search reports by name, type, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            iconPosition="left"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-primary transition-micro"
                >
                  <span>Report Name</span>
                  <Icon 
                    name={sortBy === 'name' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-1 hover:text-primary transition-micro"
                >
                  <span>Type</span>
                  <Icon 
                    name={sortBy === 'type' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 hover:text-primary transition-micro"
                >
                  <span>Generated</span>
                  <Icon 
                    name={sortBy === 'date' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Generated By</th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('size')}
                  className="flex items-center space-x-1 hover:text-primary transition-micro"
                >
                  <span>Size</span>
                  <Icon 
                    name={sortBy === 'size' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Downloads</th>
              <th className="text-right p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReports.map((report) => (
              <tr key={report.id} className="border-t border-border hover:bg-muted/20 transition-micro">
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground mb-1">{report.name}</div>
                    <div className="flex items-center space-x-2">
                      {report.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                    {report.type}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{report.generatedDate}</div>
                  <div className="text-xs text-muted-foreground">Scan: {report.scanDate}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{report.generatedBy}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{report.fileSize}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Download" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{report.downloadCount}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(report.id)}
                      iconName="Eye"
                      title="Preview"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(report.id)}
                      iconName="Download"
                      title="Download"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRegenerate(report.id)}
                      iconName="RefreshCw"
                      title="Regenerate"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                      iconName="Trash2"
                      title="Delete"
                      className="text-error hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : 'Generate your first report to see it here'}
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