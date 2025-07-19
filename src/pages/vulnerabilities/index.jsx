import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterSidebar from './components/FilterSidebar';
import RiskMetrics from './components/RiskMetrics';
import SearchAndActions from './components/SearchAndActions';
import FilterChips from './components/FilterChips';
import VulnerabilityTable from './components/VulnerabilityTable';
import fileUploadService from '../../utils/fileUploadService';
import Icon from '../../components/AppIcon';

const VulnerabilitiesPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    riskLevels: [],
    serviceTypes: [],
    patchStatuses: [],
    portRanges: []
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [scanResults, setScanResults] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState({
    totalVulnerabilities: 0,
    criticalRisk: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0
  });

  // Load scan results on component mount
  useEffect(() => {
    const loadScanResults = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        console.log('🔍 Loading scan results for user:', user.id);
        const result = await fileUploadService.getScanResults(user.id);
        
        if (result.success && result.data.length > 0) {
          console.log('✅ Found scan results:', result.data.length);
          setScanResults(result.data);
          
          // Process vulnerabilities from all scan results
          const allVulnerabilities = [];
          let totalCritical = 0;
          let totalHigh = 0;
          let totalMedium = 0;
          let totalLow = 0;
          
          result.data.forEach((scanResult, scanIndex) => {
            if (scanResult.scan_data && scanResult.scan_data.vulnerabilities) {
              console.log(`Processing scan ${scanIndex + 1} with ${scanResult.scan_data.vulnerabilities.length} vulnerabilities`);
              
              scanResult.scan_data.vulnerabilities.forEach((vuln, vulnIndex) => {
                // Transform scan data to match UI format
                const transformedVuln = {
                  id: `${scanIndex}-${vulnIndex}`,
                  serviceName: vuln.service || vuln.product || 'Unknown Service',
                  version: vuln.affectedVersion || 'Unknown',
                  port: parseInt(vuln.port) || 0,
                  protocol: vuln.protocol?.toUpperCase() || 'TCP',
                  riskLevel: vuln.severity,
                  cveIds: vuln.cve ? [vuln.cve] : [],
                  patchStatus: vuln.severity === 'critical' ? 'available' : 
                              vuln.severity === 'high' ? 'in-progress' : 'no-patch',
                  cvssScore: vuln.cvssScore?.toString() || '0.0',
                  exploitability: vuln.exploitability || 'Unknown',
                  affectedSystems: 1,
                  recommendedVersion: 'Latest',
                  host: vuln.host,
                  title: vuln.title,
                  description: vuln.description,
                  impact: vuln.impact,
                  remediation: vuln.remediation,
                  scanDate: scanResult.created_at,
                  fileName: scanResult.file_upload_logs?.file_name
                };
                
                allVulnerabilities.push(transformedVuln);
                
                // Count by severity
                switch (vuln.severity) {
                  case 'critical': totalCritical++; break;
                  case 'high': totalHigh++; break;
                  case 'medium': totalMedium++; break;
                  case 'low': totalLow++; break;
                }
              });
            }
          });
          
          console.log('📊 Processed vulnerabilities:', {
            total: allVulnerabilities.length,
            critical: totalCritical,
            high: totalHigh,
            medium: totalMedium,
            low: totalLow
          });
          
          setVulnerabilities(allVulnerabilities);
          setRiskMetrics({
            totalVulnerabilities: allVulnerabilities.length,
            criticalRisk: totalCritical,
            highRisk: totalHigh,
            mediumRisk: totalMedium,
            lowRisk: totalLow
          });
          
          console.log('🎯 Risk metrics updated:', {
            totalVulnerabilities: allVulnerabilities.length,
            criticalRisk: totalCritical,
            highRisk: totalHigh,
            mediumRisk: totalMedium,
            lowRisk: totalLow
          });
        } else {
          console.log('⚠️ No scan results found, using sample data');
          // Use sample data if no scan results
          const mockVulnerabilities = [
            {
              id: 'sample-1',
              serviceName: 'OpenSSH',
              version: '8.2',
              port: 22,
              protocol: 'TCP',
              riskLevel: 'medium',
              cveIds: ['CVE-2020-15778'],
              patchStatus: 'available',
              cvssScore: '6.5',
              exploitability: 'Medium',
              affectedSystems: 1,
              recommendedVersion: '9.0+',
              host: '192.168.1.101',
              title: 'OpenSSH Outdated Version',
              description: 'The OpenSSH server is running an outdated version that may contain security vulnerabilities.',
              impact: 'Potential unauthorized access or information disclosure',
              remediation: 'Update OpenSSH to the latest version',
              scanDate: new Date().toISOString(),
              fileName: 'sample-scan.xml'
            },
            {
              id: 'sample-2',
              serviceName: 'nginx',
              version: '1.18.0',
              port: 8080,
              protocol: 'TCP',
              riskLevel: 'low',
              cveIds: ['CVE-2021-23017'],
              patchStatus: 'available',
              cvssScore: '4.3',
              exploitability: 'Low',
              affectedSystems: 1,
              recommendedVersion: '1.20.0+',
              host: '192.168.1.101',
              title: 'nginx Outdated Version',
              description: 'The nginx server is running an outdated version.',
              impact: 'Minor security risks',
              remediation: 'Update nginx to the latest stable version',
              scanDate: new Date().toISOString(),
              fileName: 'sample-scan.xml'
            }
          ];
          setVulnerabilities(mockVulnerabilities);
          setRiskMetrics({
            totalVulnerabilities: mockVulnerabilities.length,
            criticalRisk: 0,
            highRisk: 0,
            mediumRisk: 1,
            lowRisk: 1
          });
        }
        
      } catch (err) {
        console.error('❌ Error loading scan results:', err);
        setError('Failed to load vulnerability data');
        // Fallback to empty state
        setVulnerabilities([]);
      } finally {
        setLoading(false);
      }
    };

    loadScanResults();
  }, [user?.id]);

  // Filter vulnerabilities based on active filters and search
  const filteredVulnerabilities = useMemo(() => {
    return vulnerabilities.filter(vuln => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          vuln.serviceName?.toLowerCase().includes(searchLower) ||
          vuln.version?.toLowerCase().includes(searchLower) ||
          vuln.title?.toLowerCase().includes(searchLower) ||
          vuln.description?.toLowerCase().includes(searchLower) ||
          vuln.cveIds?.some(cve => cve.toLowerCase().includes(searchLower)) ||
          vuln.host?.toLowerCase().includes(searchLower) ||
          vuln.port?.toString().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Risk level filter
      if (filters.riskLevels.length > 0) {
        if (!filters.riskLevels.includes(vuln.riskLevel?.toLowerCase())) {
          return false;
        }
      }

      // Service type filter (map service names to types)
      if (filters.serviceTypes.length > 0) {
        const serviceType = getServiceType(vuln.serviceName);
        if (!filters.serviceTypes.includes(serviceType)) {
          return false;
        }
      }

      // Patch status filter
      if (filters.patchStatuses.length > 0) {
        if (!filters.patchStatuses.includes(vuln.patchStatus)) {
          return false;
        }
      }

      // Port range filter
      if (filters.portRanges.length > 0) {
        const port = parseInt(vuln.port);
        const matchesPortRange = filters.portRanges.some(range => {
          const [min, max] = range.split('-').map(Number);
          return port >= min && port <= max;
        });
        if (!matchesPortRange) {
          return false;
        }
      }

      return true;
    });
  }, [vulnerabilities, filters, searchTerm]);

  // Helper function to map service names to service types
  const getServiceType = (serviceName) => {
    if (!serviceName) return 'unknown';
    
    const serviceNameLower = serviceName.toLowerCase();
    
    if (serviceNameLower.includes('http') || serviceNameLower.includes('apache') || 
        serviceNameLower.includes('nginx') || serviceNameLower.includes('iis')) {
      return 'web';
    }
    if (serviceNameLower.includes('mysql') || serviceNameLower.includes('postgres') || 
        serviceNameLower.includes('mongodb') || serviceNameLower.includes('redis')) {
      return 'database';
    }
    if (serviceNameLower.includes('ssh') || serviceNameLower.includes('ftp') || 
        serviceNameLower.includes('telnet') || serviceNameLower.includes('snmp')) {
      return 'network';
    }
    if (serviceNameLower.includes('java') || serviceNameLower.includes('tomcat') || 
        serviceNameLower.includes('node') || serviceNameLower.includes('python')) {
      return 'application';
    }
    
    return 'system';
  };

  // Recalculate metrics based on filtered vulnerabilities for real-time updates
  useEffect(() => {
    // Only update metrics if filters are active
    if (Object.values(filters).flat().length > 0 || searchTerm) {
      const newMetrics = {
        totalVulnerabilities: filteredVulnerabilities.length,
        criticalRisk: filteredVulnerabilities.filter(v => v.riskLevel === 'critical').length,
        highRisk: filteredVulnerabilities.filter(v => v.riskLevel === 'high').length,
        mediumRisk: filteredVulnerabilities.filter(v => v.riskLevel === 'medium').length,
        lowRisk: filteredVulnerabilities.filter(v => v.riskLevel === 'low').length
      };
      
      console.log('🔄 Updating metrics based on filtered results:', newMetrics);
      setRiskMetrics(newMetrics);
    }
  }, [filteredVulnerabilities, filters, searchTerm]);

  // Add debug logging for filters
  useEffect(() => {
    console.log('🔍 Current filters:', filters);
    console.log('📊 Total vulnerabilities:', vulnerabilities.length);
    console.log('🎯 Filtered vulnerabilities:', filteredVulnerabilities.length);
    console.log('🔎 Search term:', searchTerm);
  }, [filters, vulnerabilities, filteredVulnerabilities, searchTerm]);

  const handleFilterChange = (newFilters) => {
    console.log('🔄 Filter change received:', newFilters);
    setFilters(newFilters);
  };

  const handleRiskLevelClick = (riskLevel) => {
    const newFilters = { ...filters };
    
    if (newFilters.riskLevels.includes(riskLevel)) {
      // Remove if already selected
      newFilters.riskLevels = newFilters.riskLevels.filter(level => level !== riskLevel);
    } else {
      // Add if not selected
      newFilters.riskLevels = [...newFilters.riskLevels, riskLevel];
    }
    
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      riskLevels: [],
      serviceTypes: [],
      patchStatuses: [],
      portRanges: []
    });
    setSearchTerm('');
  };

  const handleRemoveFilter = (filterType, value) => {
    const newFilters = { ...filters };
    
    switch (filterType) {
      case 'riskLevel':
        newFilters.riskLevels = newFilters.riskLevels.filter(level => level !== value);
        break;
      case 'serviceType':
        newFilters.serviceTypes = newFilters.serviceTypes.filter(type => type !== value);
        break;
      case 'patchStatus':
        newFilters.patchStatuses = newFilters.patchStatuses.filter(status => status !== value);
        break;
      case 'portRange':
        newFilters.portRanges = newFilters.portRanges.filter(range => range !== value);
        break;
      default:
        break;
    }
    
    setFilters(newFilters);
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === filteredVulnerabilities.length 
        ? [] 
        : filteredVulnerabilities.map(vuln => vuln.id)
    );
  };

  const activeFiltersCount = Object.values(filters).flat().length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                <span className="text-muted-foreground">Loading vulnerabilities...</span>
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
        <div className="container mx-auto px-6 py-8">
          <Breadcrumb />
          
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-destructive/10 rounded-lg">
                  <Icon name="Shield" size={24} className="text-destructive" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Vulnerabilities</h1>
                  <p className="text-sm text-muted-foreground">
                    Monitor and manage security vulnerabilities from your scans
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9 space-y-6">
              {/* Risk Metrics */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Risk Overview</h2>
                  <div className="flex items-center space-x-2">
                    {(Object.values(filters).flat().length > 0 || searchTerm) ? (
                      <>
                        <Icon name="Filter" size={16} className="text-primary" />
                        <span className="text-sm text-muted-foreground">
                          Showing filtered results ({filteredVulnerabilities.length} of {vulnerabilities.length})
                        </span>
                        <button
                          onClick={handleClearFilters}
                          className="text-xs text-primary hover:text-primary/80 underline"
                        >
                          Show All
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Total vulnerabilities found: {vulnerabilities.length}
                      </span>
                    )}
                  </div>
                </div>
                <RiskMetrics 
                  metrics={riskMetrics} 
                  onRiskLevelClick={handleRiskLevelClick}
                  activeFilters={filters.riskLevels}
                />
              </div>

              {/* Search and Actions */}
              <SearchAndActions
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCount={selectedItems.length}
                totalCount={filteredVulnerabilities.length}
                onSelectAll={handleSelectAll}
                isAllSelected={selectedItems.length === filteredVulnerabilities.length && filteredVulnerabilities.length > 0}
              />

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <FilterChips
                  filters={filters}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearFilters}
                />
              )}

              {/* Vulnerabilities Table */}
              <VulnerabilityTable
                vulnerabilities={filteredVulnerabilities}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                onSelectAll={handleSelectAll}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VulnerabilitiesPage;
