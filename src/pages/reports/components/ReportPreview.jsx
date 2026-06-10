import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ReportPreview = ({ reportData, onDownload, onSaveTemplate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const scanData = reportData?.scanData || {};

  const riskDistributionData = [
    { name: 'Critical', value: scanData.criticalRisk ?? 0, color: '#DC2626' },
    { name: 'High', value: scanData.highRisk ?? 0, color: '#EA580C' },
    { name: 'Medium', value: scanData.mediumRisk ?? 0, color: '#D97706' },
    { name: 'Low', value: scanData.lowRisk ?? 0, color: '#059669' }
  ].filter(d => d.value > 0);

  const topVulnerabilities = (scanData.vulnerabilities || [])
    .sort((a, b) => (b.cvssScore ?? 0) - (a.cvssScore ?? 0))
    .slice(0, 5);

  const recommendations = scanData.recommendations?.recommendations || [];

  const pages = [
    { id: 1, title: 'Executive Summary' },
    { id: 2, title: 'Risk Analysis' },
    { id: 3, title: 'Vulnerability Details' },
    { id: 4, title: 'Recommendations' }
  ];

  const getSeverityColor = (severity) => {
    switch ((severity || '').toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const noData = !scanData || Object.keys(scanData).length === 0;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <Icon name="Eye" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Report Preview</h2>
          {reportData?.fileName && (
            <span className="text-sm text-muted-foreground">— {reportData.fileName}</span>
          )}
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {pages.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-background border border-border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(prev => Math.max(prev - 25, 50))}
              disabled={zoomLevel <= 50}
              iconName="ZoomOut"
            />
            <span className="px-2 text-sm text-muted-foreground min-w-[60px] text-center">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(prev => Math.min(prev + 25, 200))}
              disabled={zoomLevel >= 200}
              iconName="ZoomIn"
            />
          </div>
          <Button variant="outline" size="sm" onClick={onDownload} iconName="Download" iconPosition="left">
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={onSaveTemplate} iconName="Save" iconPosition="left">
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
          {noData ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Icon name="FileSearch" size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No scan data available for this report</p>
              </div>
            </div>
          ) : (
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
              {/* Page 1 — Executive Summary */}
              {currentPage === 1 && (
                <div className="space-y-8">
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
                      Generated on {new Date(reportData?.generatedAt).toLocaleDateString()} &nbsp;|&nbsp;
                      File: {reportData?.fileName ?? 'N/A'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Executive Summary</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {scanData.summary ||
                        `This vulnerability assessment identified ${scanData.totalVulnerabilities ?? 0} total vulnerabilities across ${scanData.hostsScanned ?? 0} hosts.${(scanData.criticalRisk ?? 0) > 0 ? ` There are ${scanData.criticalRisk} critical-risk issues requiring immediate attention.` : ' No critical-risk vulnerabilities were detected.'}`
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Critical', value: scanData.criticalRisk ?? 0, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
                      { label: 'High', value: scanData.highRisk ?? 0, color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
                      { label: 'Medium', value: scanData.mediumRisk ?? 0, color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
                      { label: 'Low', value: scanData.lowRisk ?? 0, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
                    ].map(item => (
                      <div key={item.label} className={`border rounded-lg p-4 text-center ${item.bg}`}>
                        <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                        <div className={`text-sm ${item.color}`}>{item.label}</div>
                      </div>
                    ))}
                  </div>

                  {riskDistributionData.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution</h3>
                      <div className="grid grid-cols-2 gap-6">
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
                        <div className="space-y-3 self-center">
                          {riskDistributionData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-gray-700">{item.name}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Page 2 — Risk Analysis */}
              {currentPage === 2 && (
                <div className="space-y-8">
                  <div className="text-center border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Risk Analysis</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {scanData.hostsScanned ?? 0} hosts &nbsp;·&nbsp;
                      {scanData.portsFound ?? 0} open ports &nbsp;·&nbsp;
                      {scanData.servicesIdentified ?? 0} services
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Assessment Matrix</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <div className="text-red-800 font-semibold mb-2">Critical Risk</div>
                        <div className="text-red-700">{scanData.criticalRisk ?? 0} vulnerabilities</div>
                        <div className="text-red-600 text-xs mt-1">Immediate action required</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                        <div className="text-orange-800 font-semibold mb-2">High Risk</div>
                        <div className="text-orange-700">{scanData.highRisk ?? 0} vulnerabilities</div>
                        <div className="text-orange-600 text-xs mt-1">Patch within 30 days</div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <div className="text-yellow-800 font-semibold mb-2">Medium Risk</div>
                        <div className="text-yellow-700">{scanData.mediumRisk ?? 0} vulnerabilities</div>
                        <div className="text-yellow-600 text-xs mt-1">Patch within 90 days</div>
                      </div>
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="text-green-800 font-semibold mb-2">Low Risk</div>
                        <div className="text-green-700">{scanData.lowRisk ?? 0} vulnerabilities</div>
                        <div className="text-green-600 text-xs mt-1">Monitor and patch</div>
                      </div>
                    </div>
                  </div>

                  {scanData.scanDetails && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Scan Details</h3>
                      <table className="w-full text-sm border-collapse">
                        <tbody>
                          {Object.entries(scanData.scanDetails).map(([key, val]) => (
                            <tr key={key} className="border-b border-gray-100">
                              <td className="py-2 pr-4 text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                              <td className="py-2 text-gray-800 font-medium">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Page 3 — Vulnerability Details */}
              {currentPage === 3 && (
                <div className="space-y-6">
                  <div className="text-center border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Vulnerability Details</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Top {topVulnerabilities.length} of {scanData.totalVulnerabilities ?? 0} vulnerabilities
                    </p>
                  </div>

                  {topVulnerabilities.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No vulnerability detail data available</p>
                  ) : (
                    <div className="space-y-4">
                      {topVulnerabilities.map((vuln, i) => (
                        <div key={vuln.id ?? i} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-1">
                            {vuln.cve && <span className="font-mono text-sm text-blue-600">{vuln.cve}</span>}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                              {vuln.severity}
                            </span>
                            {vuln.cvssScore && <span className="text-sm text-gray-600">CVSS: {vuln.cvssScore}</span>}
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{vuln.title}</h4>
                          <div className="text-xs text-gray-500 space-x-3 mb-2">
                            {vuln.host && <span>Host: {vuln.host}</span>}
                            {vuln.port && <span>Port: {vuln.port}/{vuln.protocol}</span>}
                            {vuln.service && <span>Service: {vuln.service}</span>}
                          </div>
                          {vuln.remediation && (
                            <p className="text-xs text-gray-600 border-l-2 border-blue-200 pl-2">
                              {vuln.remediation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Page 4 — Recommendations */}
              {currentPage === 4 && (
                <div className="space-y-6">
                  <div className="text-center border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Recommendations</h2>
                    {scanData.recommendations?.priority && (
                      <p className="text-sm text-gray-500 mt-1">
                        Priority: <span className="font-medium capitalize">{scanData.recommendations.priority}</span>
                      </p>
                    )}
                  </div>

                  {recommendations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recommendations data available</p>
                  ) : (
                    <div className="space-y-4">
                      {recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className={`border rounded-lg p-4 ${
                            rec.timeframe === 'immediate'
                              ? 'bg-red-50 border-red-200'
                              : rec.timeframe === 'days'
                                ? 'bg-orange-50 border-orange-200'
                                : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <h4 className="font-semibold mb-2">{rec.title}</h4>
                          <p className="text-sm mb-3">{rec.description}</p>
                          {rec.steps && rec.steps.length > 0 && (
                            <ul className="text-sm space-y-1">
                              {rec.steps.map((step, si) => <li key={si}>• {step}</li>)}
                            </ul>
                          )}
                          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                            {rec.timeframe && <span>Timeframe: {rec.timeframe}</span>}
                            {rec.difficulty && <span>Difficulty: {rec.difficulty}</span>}
                            {rec.cost && <span>Cost: {rec.cost}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
