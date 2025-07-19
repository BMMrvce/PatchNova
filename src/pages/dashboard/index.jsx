import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Mock dashboard data
  const mockDashboardData = {
    metrics: {
      totalVulnerabilities: 27,
      criticalVulnerabilities: 12,
      highVulnerabilities: 34,
      mediumVulnerabilities: 89,
      lowVulnerabilities: 112,
      patchedVulnerabilities: 156,
      unpatchedVulnerabilities: 91,
      inProgressPatches: 23,
      totalHosts: 45,
      lastScanDate: "2025-01-10T14:30:00Z"
    },
    riskDistribution: {
      critical: 12,
      high: 34,
      medium: 89,
      low: 112
    },
    patchStatus: {
      patched: 156,
      inProgress: 23,
      unpatched: 91
    },
    recentScans: [
      {
        id: 1,
        date: "2025-01-10T14:30:00Z",
        target: "Production Network",
        scanType: "Full Network Scan",
        hostCount: 45,
        vulnerabilityCount: 247,
        criticalCount: 12,
        highCount: 34,
        riskLevel: "Critical",
        status: "Completed"
      },
      {
        id: 2,
        date: "2025-01-09T09:15:00Z",
        target: "DMZ Servers",
        scanType: "Targeted Scan",
        hostCount: 8,
        vulnerabilityCount: 23,
        criticalCount: 2,
        highCount: 5,
        riskLevel: "High",
        status: "Completed"
      },
      {
        id: 3,
        date: "2025-01-08T16:45:00Z",
        target: "Web Applications",
        scanType: "Application Scan",
        hostCount: 12,
        vulnerabilityCount: 67,
        criticalCount: 4,
        highCount: 15,
        riskLevel: "High",
        status: "Completed"
      },
      {
        id: 4,
        date: "2025-01-07T11:20:00Z",
        target: "Internal Network",
        scanType: "Compliance Scan",
        hostCount: 32,
        vulnerabilityCount: 145,
        criticalCount: 6,
        highCount: 48,
        riskLevel: "Medium",
        status: "In Progress"
      }
    ],
    activities: [
      {
        id: 1,
        type: 'scan',
        user: 'John Smith',
        action: 'completed a network scan',
        details: 'Production Network - 247 vulnerabilities found',
        timestamp: "2025-01-10T14:30:00Z"
      },
      {
        id: 2,
        type: 'patch',
        user: 'Sarah Johnson',
        action: 'applied security patches',
        details: 'Updated 15 critical vulnerabilities on web servers',
        timestamp: "2025-01-10T12:15:00Z"
      },
      {
        id: 3,
        type: 'ai',
        user: 'Mike Wilson',
        action: 'requested AI analysis',
        details: 'Generated patch recommendations for CVE-2024-1234',
        timestamp: "2025-01-10T10:45:00Z"
      },
      {
        id: 4,
        type: 'report',
        user: 'Lisa Chen',
        action: 'generated security report',
        details: 'Monthly vulnerability assessment report',
        timestamp: "2025-01-10T09:30:00Z"
      },
      {
        id: 5,
        type: 'alert',
        user: 'System',
        action: 'detected new critical vulnerability',
        details: 'CVE-2025-0001 affects 8 hosts in production',
        timestamp: "2025-01-10T08:20:00Z"
      }
    ]
  };

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(mockDashboardData);
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const handleUploadScan = () => {
    navigate('/upload-scan');
  };

  const handleViewCritical = () => {
    navigate('/vulnerabilities?filter=critical');
  };

  const handleGenerateReport = () => {
    navigate('/reports');
  };

  const handleAIAnalysis = () => {
    navigate('/ai-chat-analysis');
  };

  const handleViewScanDetails = (scanId) => {
    navigate(`/vulnerabilities?scan=${scanId}`);
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Monitor your organization's vulnerability posture and security metrics
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
              value={dashboardData.metrics.totalVulnerabilities}
              icon="Shield"
              color="info"
              trend="up"
              trendValue="+12"
              description="Across all scanned hosts"
            />
            <MetricsCard
              title="Critical Issues"
              value={dashboardData.metrics.criticalVulnerabilities}
              icon="AlertTriangle"
              color="critical"
              trend="down"
              trendValue="-3"
              description="Require immediate attention"
            />
            <MetricsCard
              title="Patched Vulnerabilities"
              value={dashboardData.metrics.patchedVulnerabilities}
              icon="CheckCircle"
              color="success"
              trend="up"
              trendValue="+23"
              description="Successfully remediated"
            />
            <MetricsCard
              title="Active Hosts"
              value={dashboardData.metrics.totalHosts}
              icon="Server"
              color="info"
              description="Currently monitored"
            />
          </div>

          {/* Charts and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <RiskDistributionChart data={dashboardData.riskDistribution} />
            <PatchStatusChart data={dashboardData.patchStatus} />
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
                scans={dashboardData.recentScans}
                onViewDetails={handleViewScanDetails}
              />
            </div>
            <div className="xl:col-span-1">
              <ActivityFeed activities={dashboardData.activities} />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Scan Coverage</h3>
                <Icon name="Target" size={20} className="text-muted-foreground" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Network Coverage</span>
                  <span className="text-sm font-medium text-foreground">87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Full Scan</span>
                  <span className="text-sm font-medium text-foreground">2 days ago</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Compliance Score</h3>
                <Icon name="Award" size={20} className="text-muted-foreground" />
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">92</div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">NIST</span>
                    <span className="text-foreground">94%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ISO 27001</span>
                    <span className="text-foreground">89%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Threat Intelligence</h3>
                <Icon name="Zap" size={20} className="text-muted-foreground" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Threats</span>
                  <span className="text-sm font-medium text-error">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New CVEs Today</span>
                  <span className="text-sm font-medium text-warning">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk Score</span>
                  <span className="text-sm font-medium text-foreground">Medium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;