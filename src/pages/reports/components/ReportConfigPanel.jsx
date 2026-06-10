import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportConfigPanel = ({ onGenerateReport, isGenerating, scanOptions = [] }) => {
  const [reportConfig, setReportConfig] = useState({
    type: 'executive',
    scanId: '',
    includedSections: {
      executiveSummary: true,
      vulnerabilityDetails: true,
      riskAnalysis: true,
      recommendations: true,
      compliance: false
    },
    riskThreshold: 'medium',
    includeBranding: true
  });

  const reportTypes = [
    { value: 'executive', label: 'Executive Summary' },
    { value: 'technical', label: 'Technical Details' },
    { value: 'compliance', label: 'Compliance Report' }
  ];

  const riskThresholds = [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'critical', label: 'Critical Only' },
    { value: 'high', label: 'High & Above' },
    { value: 'medium', label: 'Medium & Above' }
  ];

  const handleConfigChange = (field, value) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectionToggle = (section) => {
    setReportConfig(prev => ({
      ...prev,
      includedSections: {
        ...prev.includedSections,
        [section]: !prev.includedSections[section]
      }
    }));
  };

  const handleGenerateReport = () => {
    onGenerateReport(reportConfig);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Settings" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Report Configuration</h2>
      </div>

      <div className="space-y-6">
        {/* Report Type */}
        <div>
          <Select
            label="Report Type"
            options={reportTypes}
            value={reportConfig.type}
            onChange={(value) => handleConfigChange('type', value)}
            placeholder="Select report type"
          />
        </div>

        {/* Scan Selection */}
        <div>
          <Select
            label="Select Scan"
            options={scanOptions}
            value={reportConfig.scanId}
            onChange={(value) => handleConfigChange('scanId', value)}
            placeholder={scanOptions.length === 0 ? 'No scans available — upload a scan first' : 'Choose scan to report on'}
            searchable
          />
        </div>

        {/* Included Sections */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Included Sections</label>
          <div className="space-y-3">
            <Checkbox
              label="Executive Summary"
              checked={reportConfig.includedSections.executiveSummary}
              onChange={() => handleSectionToggle('executiveSummary')}
            />
            <Checkbox
              label="Vulnerability Details"
              checked={reportConfig.includedSections.vulnerabilityDetails}
              onChange={() => handleSectionToggle('vulnerabilityDetails')}
            />
            <Checkbox
              label="Risk Analysis"
              checked={reportConfig.includedSections.riskAnalysis}
              onChange={() => handleSectionToggle('riskAnalysis')}
            />
            <Checkbox
              label="Recommendations"
              checked={reportConfig.includedSections.recommendations}
              onChange={() => handleSectionToggle('recommendations')}
            />
            <Checkbox
              label="Compliance Mapping"
              checked={reportConfig.includedSections.compliance}
              onChange={() => handleSectionToggle('compliance')}
            />
          </div>
        </div>

        {/* Risk Threshold */}
        <div>
          <Select
            label="Risk Threshold"
            options={riskThresholds}
            value={reportConfig.riskThreshold}
            onChange={(value) => handleConfigChange('riskThreshold', value)}
            placeholder="Select minimum risk level"
          />
        </div>

        {/* Branding Options */}
        <div>
          <Checkbox
            label="Include Company Branding"
            description="Add your organization's logo and branding elements"
            checked={reportConfig.includeBranding}
            onChange={() => handleConfigChange('includeBranding', !reportConfig.includeBranding)}
          />
        </div>

        {/* Generate Button */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="default"
            fullWidth
            loading={isGenerating}
            onClick={handleGenerateReport}
            iconName="FileText"
            iconPosition="left"
            disabled={!reportConfig.scanId}
          >
            {isGenerating ? 'Generating Report...' : 'Generate Report'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportConfigPanel;