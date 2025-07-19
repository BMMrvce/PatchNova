import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReportPreview = ({ reportData, onDownload, onEmail, onSaveTemplate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const riskDistributionData = [
    { name: 'Critical', value: 12, color: '#DC2626' },
    { name: 'High', value: 28, color: '#EA580C' },
    { name: 'Medium', value: 45, color: '#D97706' },
    { name: 'Low', value: 23, color: '#059669' }
  ];

  const vulnerabilityTrendData = [
    { month: 'Jan', critical: 8, high: 15, medium: 32, low: 18 },
    { month: 'Feb', critical: 12, high: 22, medium: 38, low: 25 },
    { month: 'Mar', critical: 15, high: 28, medium: 42, low: 28 },
    { month: 'Apr', critical: 10, high: 25, medium: 40, low: 22 },
    { month: 'May', critical: 8, high: 20, medium: 35, low: 20 },
    { month: 'Jun', critical: 12, high: 28, medium: 45, low: 23 }
  ];

  const topVulnerabilities = [
    {
      id: 'CVE-2024-1234',
      title: 'Remote Code Execution in Apache HTTP Server',
      severity: 'Critical',
      cvss: 9.8,
      affected: 15,
      status: 'Unpatched'
    },
    {
      id: 'CVE-2024-5678',
      title: 'SQL Injection in MySQL Database',
      severity: 'High',
      cvss: 8.1,
      affected: 8,
      status: 'Patching'
    },
    {
      id: 'CVE-2024-9012',
      title: 'Cross-Site Scripting in Web Application',
      severity: 'Medium',
      cvss: 6.5,
      affected: 12,
      status: 'Patched'
    }
  ];

  const pages = [
    { id: 1, title: 'Executive Summary', thumbnail: '/api/placeholder/120/160' },
    { id: 2, title: 'Risk Analysis', thumbnail: '/api/placeholder/120/160' },
    { id: 3, title: 'Vulnerability Details', thumbnail: '/api/placeholder/120/160' },
    { id: 4, title: 'Recommendations', thumbnail: '/api/placeholder/120/160' }
  ];

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'patched': return 'text-green-600 bg-green-50';
      case 'patching': return 'text-blue-600 bg-blue-50';
      case 'unpatched': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <Icon name="Eye" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Report Preview</h2>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {pages.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-background border border-border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              iconName="ZoomOut"
            />
            <span className="px-2 text-sm text-muted-foreground min-w-[60px] text-center">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              iconName="ZoomIn"
            />
          </div>

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            iconName="Download"
            iconPosition="left"
          >
            Download PDF
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            onClick={onEmail}
            iconName="Mail"
            iconPosition="left"
          >
            Email
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveTemplate}
            iconName="Save"
            iconPosition="left"
          >
            Save Template
          </Button>
        </div>
      </div>

      <div className="flex h-[800px]">
        {/* Page Navigation Sidebar */}
        <div className="w-48 bg-muted/20 border-r border-border p-4 overflow-y-auto">
          <h3 className="text-sm font-medium text-foreground mb-3">Pages</h3>
          <div className="space-y-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`w-full p-2 rounded-md text-left transition-micro ${
                  currentPage === page.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <div className="text-xs font-medium">{page.id}</div>
                <div className="text-xs truncate">{page.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div 
            className="bg-white shadow-elevation-2 mx-auto transition-transform duration-200"
            style={{ 
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              width: '8.5in',
              minHeight: '11in',
              padding: '1in'
            }}
          >
            {/* Report Content Based on Current Page */}
            {currentPage === 1 && (
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Icon name="Shield" size={20} color="white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">PatchNova</h1>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Vulnerability Assessment Report
                  </h2>
                  <p className="text-gray-600">Executive Summary</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Generated on July 11, 2025 | Report Period: July 1-11, 2025
                  </p>
                </div>

                {/* Executive Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Executive Summary</h3>
                  <div className="prose text-gray-700 text-sm leading-relaxed">
                    <p className="mb-4">
                      This vulnerability assessment report provides a comprehensive analysis of the security posture 
                      of your network infrastructure. Our AI-powered analysis has identified 108 total vulnerabilities 
                      across your systems, with 12 classified as critical risk requiring immediate attention.
                    </p>
                    <p className="mb-4">
                      The assessment reveals that 78% of identified vulnerabilities have available patches, indicating 
                      strong vendor support for remediation. However, 24 high-risk vulnerabilities remain unpatched, 
                      presenting significant security exposure that should be addressed within the next 30 days.
                    </p>
                    <p>
                      Key recommendations include prioritizing critical Apache HTTP Server vulnerabilities, 
                      implementing automated patch management processes, and establishing regular vulnerability 
                      scanning schedules to maintain security posture.
                    </p>
                  </div>
                </div>

                {/* Risk Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={riskDistributionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {riskDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {riskDistributionData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-700">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 2 && (
              <div className="space-y-8">
                <div className="text-center border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Risk Analysis</h2>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Vulnerability Trend Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vulnerabilityTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="critical" stackId="a" fill="#DC2626" />
                      <Bar dataKey="high" stackId="a" fill="#EA580C" />
                      <Bar dataKey="medium" stackId="a" fill="#D97706" />
                      <Bar dataKey="low" stackId="a" fill="#059669" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Assessment Matrix</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <div className="text-red-800 font-semibold mb-2">Critical Risk</div>
                      <div className="text-red-700">12 vulnerabilities</div>
                      <div className="text-red-600 text-xs mt-1">Immediate action required</div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <div className="text-orange-800 font-semibold mb-2">High Risk</div>
                      <div className="text-orange-700">28 vulnerabilities</div>
                      <div className="text-orange-600 text-xs mt-1">Patch within 30 days</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <div className="text-yellow-800 font-semibold mb-2">Medium Risk</div>
                      <div className="text-yellow-700">45 vulnerabilities</div>
                      <div className="text-yellow-600 text-xs mt-1">Patch within 90 days</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="text-green-800 font-semibold mb-2">Low Risk</div>
                      <div className="text-green-700">23 vulnerabilities</div>
                      <div className="text-green-600 text-xs mt-1">Monitor and patch</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 3 && (
              <div className="space-y-6">
                <div className="text-center border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Vulnerability Details</h2>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Critical Vulnerabilities</h3>
                  <div className="space-y-4">
                    {topVulnerabilities.map((vuln) => (
                      <div key={vuln.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-mono text-sm text-blue-600">{vuln.id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                                {vuln.severity}
                              </span>
                              <span className="text-sm text-gray-600">CVSS: {vuln.cvss}</span>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">{vuln.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Affected Systems: {vuln.affected}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vuln.status)}`}>
                                {vuln.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentPage === 4 && (
              <div className="space-y-6">
                <div className="text-center border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Recommendations</h2>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Immediate Actions Required</h3>
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Critical Priority</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Patch Apache HTTP Server (CVE-2024-1234) on 15 affected systems</li>
                        <li>• Update MySQL database instances to latest version</li>
                        <li>• Implement network segmentation for critical systems</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">High Priority</h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Deploy security patches for web applications</li>
                        <li>• Configure automated vulnerability scanning</li>
                        <li>• Establish patch management procedures</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Strategic Recommendations</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Implement continuous monitoring solutions</li>
                        <li>• Develop incident response procedures</li>
                        <li>• Conduct regular security awareness training</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;