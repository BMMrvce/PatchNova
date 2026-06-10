import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import RiskDistributionChart from './components/RiskDistributionChart';
import PatchStatusChart from './components/PatchStatusChart';
import RecentScansTable from './components/RecentScansTable';
import QuickActionsPanel from './components/QuickActionsPanel';
import ActivityFeed from './components/ActivityFeed';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import fileUploadService from '../../utils/fileUploadService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const scansResult = await fileUploadService.getScanResults(user.id, 10);
      const scans = scansResult?.success ? (scansResult.data || []) : [];

      let totalVulnerabilities = 0;
      let criticalVulnerabilities = 0;
      let highVulnerabilities = 0;
      let mediumVulnerabilities = 0;
      let lowVulnerabilities = 0;
      let totalHosts = 0;

      scans.forEach(scan => {
        const data = scan.scan_data || {};
        totalVulnerabilities += data.totalVulnerabilities ?? scan.vulnerabilities_found ?? 0;
        criticalVulnerabilities += data.criticalRisk ?? 0;
        highVulnerabilities += data.highRisk ?? scan.high_risk_count ?? 0;
        mediumVulnerabilities += data.mediumRisk ?? scan.medium_risk_count ?? 0;
        lowVulnerabilities += data.lowRisk ?? scan.low_risk_count ?? 0;
        totalHosts += data.hostsScanned ?? 0;
      });

      const recentScans = scans.map((scan, i) => {
        const data = scan.scan_data || {};
        const critical = data.criticalRisk ?? 0;
        const high = data.highRisk ?? scan.high_risk_count ?? 0;
        return {
          id: scan.id,
          date: scan.created_at,
          target: scan.file_upload_logs?.file_name ?? `Scan ${i + 1}`,
          scanType: data.scanDetails?.scanType ?? 'Nmap XML Scan',
          hostCount: data.hostsScanned ?? 0,
          vulnerabilityCount: data.totalVulnerabilities ?? scan.vulnerabilities_found ?? 0,
          criticalCount: critical,
          highCount: high,
          riskLevel: critical > 0 ? 'Critical' : high > 0 ? 'High' : 'Medium',
          status: scan.scan_status === 'completed' ? 'Completed' : scan.scan_status ?? 'Unknown'
        };
      });

      const activities = scans.slice(0, 5).map(scan => {
        const data = scan.scan_data || {};
        return {
          id: scan.id,
          type: 'scan',
          user: user.email ?? 'User',
          action: 'completed a vulnerability scan',
          details: `${scan.file_upload_logs?.file_name ?? 'File'} — ${data.totalVulnerabilities ?? scan.vulnerabilities_found ?? 0} vulnerabilities found`,
          timestamp: scan.created_at
        };
      });

      setDashboardData({
        metrics: {
          totalVulnerabilities,
          criticalVulnerabilities,
          highVulnerabilities,
          mediumVulnerabilities,
          lowVulnerabilities,
          totalHosts,
          lastScanDate: scans[0]?.created_at ?? null,
          scanCount: scans.length
        },
        riskDistribution: {
          critical: criticalVulnerabilities,
          high: highVulnerabilities,
          medium: mediumVulnerabilities,
          low: lowVulnerabilities
        },
        patchStatus: {
          patched: 0,
          inProgress: 0,
          unpatched: totalVulnerabilities
        },
        recentScans,
        activities
      });
    } catch (err) {
      console.error('Dashboard load error:', err);
      setDashboardData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadScan = () => navigate('/upload-scan');
  const handleViewCritical = () => navigate('/vulnerabilities?filter=critical');
  const handleGenerateReport = () => navigate('/reports');
  const handleAIAnalysis = () => navigate('/ai-chat-analysis');
  const handleViewScanDetails = (scanId) => navigate(`/vulnerabilities?scan=${scanId}`);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Loading dashboard...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!dashboardData || dashboardData.metrics.scanCount === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Breadcrumb />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Monitor your organization's vulnerability posture and security metrics
                </p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-16 text-center">
              <Icon name="ShieldOff" size={56} className="text-muted-foreground mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-foreground mb-3">No Scans Yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Upload an Nmap XML file to run your first vulnerability scan. Results will appear here automatically.
              </p>
              <Button
                variant="default"
                size="lg"
                iconName="Upload"
                iconPosition="left"
                onClick={handleUploadScan}
              >
                Upload Your First Scan
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { metrics, riskDistribution, patchStatus, recentScans, activities } = dashboardData;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                {metrics.lastScanDate
                  ? `Last scan: ${new Date(metrics.lastScanDate).toLocaleDateString()}`
                  : 'Monitor your organization\'s vulnerability posture'}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="default"
                size="lg"
                iconName="Upload"
                iconPosition="left"
                onClick={handleUploadScan}
              >
                Upload New Scan
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total Vulnerabilities"
              value={metrics.totalVulnerabilities}
              icon="Shield"
              color="info"
              description={`Across ${metrics.scanCount} scan${metrics.scanCount !== 1 ? 's' : ''}`}
            />
            <MetricsCard
              title="Critical Issues"
              value={metrics.criticalVulnerabilities}
              icon="AlertTriangle"
              color="critical"
              description="Require immediate attention"
            />
            <MetricsCard
              title="High Risk"
              value={metrics.highVulnerabilities}
              icon="AlertCircle"
              color="warning"
              description="Patch within 30 days"
            />
            <MetricsCard
              title="Hosts Scanned"
              value={metrics.totalHosts}
              icon="Server"
              color="info"
              description="Total across all scans"
            />
          </div>

          {/* Charts and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <RiskDistributionChart data={riskDistribution} />
            <PatchStatusChart data={patchStatus} />
            <QuickActionsPanel
              onUploadScan={handleUploadScan}
              onViewCritical={handleViewCritical}
              onGenerateReport={handleGenerateReport}
              onAIAnalysis={handleAIAnalysis}
            />
          </div>

          {/* Recent Scans and Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <RecentScansTable
                scans={recentScans}
                onViewDetails={handleViewScanDetails}
              />
            </div>
            <div className="xl:col-span-1">
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
