import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import authService from '../../utils/authService';
import fileUploadService from '../../utils/fileUploadService';
import { format } from 'date-fns';

const LogsPage = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [loginLogs, setLoginLogs] = useState([]);
  const [fileUploadLogs, setFileUploadLogs] = useState([]);
  const [scanResults, setScanResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    timeRange: 'week',
    logType: 'all',
    status: 'all'
  });

  useEffect(() => {
    if (user?.id) {
      loadLogs();
    }
  }, [user?.id, activeTab, filters]);

  const loadLogs = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      switch (activeTab) {
        case 'login':
          await loadLoginLogs();
          break;
        case 'uploads':
          await loadFileUploadLogs();
          break;
        case 'scans':
          await loadScanResults();
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Failed to load logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadLoginLogs = async () => {
    const isAdmin = userProfile?.role === 'admin';
    const result = isAdmin 
      ? await authService.getAllLoginLogs(100)
      : await authService.getLoginLogs(user.id, 50);

    if (result?.success) {
      setLoginLogs(result.data);
    } else {
      setError(result?.error || 'Failed to load login logs');
    }
  };

  const loadFileUploadLogs = async () => {
    const isAdmin = userProfile?.role === 'admin';
    const result = isAdmin 
      ? await fileUploadService.getAllFileUploadLogs(100)
      : await fileUploadService.getFileUploadLogs(user.id, 50);

    if (result?.success) {
      setFileUploadLogs(result.data);
    } else {
      setError(result?.error || 'Failed to load file upload logs');
    }
  };

  const loadScanResults = async () => {
    const isAdmin = userProfile?.role === 'admin';
    const result = isAdmin 
      ? await fileUploadService.getAllScanResults(100)
      : await fileUploadService.getScanResults(user.id, 50);

    if (result?.success) {
      setScanResults(result.data);
    } else {
      setError(result?.error || 'Failed to load scan results');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'success':
        return 'text-success';
      case 'error': case'failed':
        return 'text-error';
      case 'processing': case'pending':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getLogTypeIcon = (type) => {
    switch (type) {
      case 'login':
        return 'LogIn';
      case 'logout':
        return 'LogOut';
      case 'failed_login':
        return 'AlertCircle';
      case 'password_reset':
        return 'Key';
      default:
        return 'Info';
    }
  };

  const renderLoginLogs = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (loginLogs.length === 0) {
      return (
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No login logs found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {loginLogs.map((log) => (
          <div key={log.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  log.success ? 'bg-success/10' : 'bg-error/10'
                }`}>
                  <Icon 
                    name={getLogTypeIcon(log.log_type)} 
                    size={16} 
                    className={log.success ? 'text-success' : 'text-error'}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-foreground capitalize">
                    {log.log_type?.replace('_', ' ')} 
                    {log.user_profiles?.full_name && (
                      <span className="font-normal text-muted-foreground ml-2">
                        - {log.user_profiles.full_name}
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${log.success ? 'text-success' : 'text-error'}`}>
                  {log.success ? 'Success' : 'Failed'}
                </div>
                {log.ip_address && (
                  <div className="text-xs text-muted-foreground">
                    {log.ip_address}
                  </div>
                )}
              </div>
            </div>
            
            {(log.location || log.failure_reason) && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {log.location && (
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2 text-foreground">{log.location}</span>
                    </div>
                  )}
                  {log.failure_reason && (
                    <div>
                      <span className="text-muted-foreground">Reason:</span>
                      <span className="ml-2 text-error">{log.failure_reason}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFileUploadLogs = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (fileUploadLogs.length === 0) {
      return (
        <div className="text-center py-8">
          <Icon name="Upload" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No file upload logs found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {fileUploadLogs.map((log) => (
          <div key={log.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                  <Icon name="FileText" size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {log.file_name}
                    {log.user_profiles?.full_name && (
                      <span className="font-normal text-muted-foreground ml-2">
                        - {log.user_profiles.full_name}
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getStatusColor(log.upload_status)}`}>
                  {log.upload_status?.replace('_', ' ')}
                </div>
                {log.file_size && (
                  <div className="text-xs text-muted-foreground">
                    {(log.file_size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 text-foreground">{log.file_type}</span>
                </div>
                {log.processing_time_ms && (
                  <div>
                    <span className="text-muted-foreground">Processing Time:</span>
                    <span className="ml-2 text-foreground">{log.processing_time_ms}ms</span>
                  </div>
                )}
              </div>
              
              {log.error_message && (
                <div className="mt-2 p-2 bg-error/10 rounded text-sm text-error">
                  {log.error_message}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderScanResults = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (scanResults.length === 0) {
      return (
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No scan results found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {scanResults.map((result) => (
          <div key={result.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-accent/10 rounded-full">
                  <Icon name="Shield" size={16} className="text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {result.file_upload_logs?.file_name}
                    {result.user_profiles?.full_name && (
                      <span className="font-normal text-muted-foreground ml-2">
                        - {result.user_profiles.full_name}
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(result.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getStatusColor(result.scan_status)}`}>
                  {result.scan_status?.replace('_', ' ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {result.vulnerabilities_found} vulnerabilities
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-error font-medium">{result.high_risk_count}</div>
                  <div className="text-muted-foreground">High Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-warning font-medium">{result.medium_risk_count}</div>
                  <div className="text-muted-foreground">Medium Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-success font-medium">{result.low_risk_count}</div>
                  <div className="text-muted-foreground">Low Risk</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-6 py-8">
          <Breadcrumb />
          
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name="Activity" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
                <p className="text-sm text-muted-foreground">
                  View and analyze system activity logs and reports
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Select
                value={filters.timeRange}
                onValueChange={(value) => handleFilterChange('timeRange', value)}
                options={[
                  { value: 'day', label: 'Last 24 hours' },
                  { value: 'week', label: 'Last week' },
                  { value: 'month', label: 'Last month' },
                  { value: 'all', label: 'All time' }
                ]}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={loadLogs}
                disabled={loading}
                iconName="RefreshCw"
              >
                Refresh
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
              {[
                { key: 'login', label: 'Login Logs', icon: 'LogIn' },
                { key: 'uploads', label: 'File Uploads', icon: 'Upload' },
                { key: 'scans', label: 'Scan Results', icon: 'Shield' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <p className="text-sm text-error">{error}</p>
                </div>
              </div>
            )}

            {activeTab === 'login' && renderLoginLogs()}
            {activeTab === 'uploads' && renderFileUploadLogs()}
            {activeTab === 'scans' && renderScanResults()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogsPage;