import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ReportConfigPanel from './components/ReportConfigPanel';
import ReportPreview from './components/ReportPreview';
import ReportHistory from './components/ReportHistory';
import ProgressModal from './components/ProgressModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState('generate');

  const handleGenerateReport = (config) => {
    setIsGenerating(true);
    setShowProgressModal(true);
    
    // Simulate report generation
    setTimeout(() => {
      setReportData({
        config,
        generatedAt: new Date().toISOString(),
        id: `rpt-${Date.now()}`
      });
    }, 100);
  };

  const handleProgressComplete = () => {
    setIsGenerating(false);
    setShowProgressModal(false);
    setActiveTab('preview');
  };

  const handleDownloadReport = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '/api/placeholder/report.pdf';
    link.download = `vulnerability-report-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEmailReport = () => {
    // Simulate email functionality
    alert('Email functionality would be implemented here');
  };

  const handleSaveTemplate = () => {
    // Simulate save template functionality
    alert('Template saved successfully!');
  };

  const handleRegenerateReport = (reportId) => {
    // Simulate regeneration
    setIsGenerating(true);
    setShowProgressModal(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowProgressModal(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
              <p className="text-muted-foreground">
                Generate, preview, and manage comprehensive vulnerability assessment reports
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
              >
                Sample Report
              </Button>
              <Button
                variant="outline"
                iconName="Settings"
                iconPosition="left"
              >
                Templates
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 mb-8 bg-muted/30 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro ${
                activeTab === 'generate' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Plus" size={16} />
              <span>Generate Report</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro ${
                activeTab === 'preview' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
              disabled={!reportData}
            >
              <Icon name="Eye" size={16} />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro ${
                activeTab === 'history' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="History" size={16} />
              <span>History</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'generate' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Configuration Panel */}
              <div className="lg:col-span-4">
                <ReportConfigPanel
                  onGenerateReport={handleGenerateReport}
                  isGenerating={isGenerating}
                />
              </div>

              {/* Template Preview */}
              <div className="lg:col-span-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Icon name="Layout" size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Report Templates</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Executive Summary Template */}
                    <div className="border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-micro">
                      <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 rounded-md mb-4 flex items-center justify-center">
                        <Icon name="BarChart3" size={32} className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Executive Summary</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        High-level overview with risk metrics, charts, and strategic recommendations for leadership.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">2-4 pages</span>
                        <Button variant="outline" size="sm">Preview</Button>
                      </div>
                    </div>

                    {/* Technical Details Template */}
                    <div className="border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-micro">
                      <div className="aspect-[4/3] bg-gradient-to-br from-purple-50 to-purple-100 rounded-md mb-4 flex items-center justify-center">
                        <Icon name="Code" size={32} className="text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Technical Details</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Comprehensive technical analysis with detailed vulnerability information and remediation steps.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">8-12 pages</span>
                        <Button variant="outline" size="sm">Preview</Button>
                      </div>
                    </div>

                    {/* Compliance Template */}
                    <div className="border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-micro">
                      <div className="aspect-[4/3] bg-gradient-to-br from-green-50 to-green-100 rounded-md mb-4 flex items-center justify-center">
                        <Icon name="Shield" size={32} className="text-green-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Compliance Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Structured report mapping vulnerabilities to compliance frameworks and standards.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">6-8 pages</span>
                        <Button variant="outline" size="sm">Preview</Button>
                      </div>
                    </div>

                    {/* Custom Template */}
                    <div className="border border-dashed border-border rounded-lg p-4 hover:shadow-elevation-2 transition-micro">
                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-md mb-4 flex items-center justify-center">
                        <Icon name="Plus" size={32} className="text-gray-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Custom Template</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create your own report template with custom sections and branding.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Variable</span>
                        <Button variant="outline" size="sm">Create</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && reportData && (
            <ReportPreview
              reportData={reportData}
              onDownload={handleDownloadReport}
              onEmail={handleEmailReport}
              onSaveTemplate={handleSaveTemplate}
            />
          )}

          {activeTab === 'history' && (
            <ReportHistory onRegenerateReport={handleRegenerateReport} />
          )}

          {/* Empty State for Preview */}
          {activeTab === 'preview' && !reportData && (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Report to Preview</h3>
              <p className="text-muted-foreground mb-6">
                Generate a report first to see the preview here
              </p>
              <Button
                variant="default"
                onClick={() => setActiveTab('generate')}
                iconName="Plus"
                iconPosition="left"
              >
                Generate Report
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Progress Modal */}
      <ProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        onComplete={handleProgressComplete}
      />
    </div>
  );
};

export default Reports;