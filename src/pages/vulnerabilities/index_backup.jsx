import React, { useState, useEffect } from 'react';
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
        const result = await fileUploadService.getScanResults(user.id);
        
        if (result.success && result.data.length > 0) {
          setScanResults(result.data);
          
          // Process vulnerabilities from all scan results
          const allVulnerabilities = [];
          let totalCritical = 0;
          let totalHigh = 0;
          let totalMedium = 0;
          let totalLow = 0;
          
          result.data.forEach((scanResult, scanIndex) => {
            if (scanResult.scan_data && scanResult.scan_data.vulnerabilities) {
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
          
          setVulnerabilities(allVulnerabilities);
          setRiskMetrics({
            totalVulnerabilities: allVulnerabilities.length,
            criticalRisk: totalCritical,
            highRisk: totalHigh,
            mediumRisk: totalMedium,
            lowRisk: totalLow
          });
        } else {
          // Use mock data if no scan results
          const mockVulnerabilities = [
            {
              id: 1,
              serviceName: 'Apache HTTP Server',
              version: '2.4.41',
              port: 80,
              protocol: 'HTTP',
              riskLevel: 'critical',
              cveIds: ['CVE-2024-1234', 'CVE-2024-5678'],
              patchStatus: 'available',
              cvssScore: '9.8',
              exploitability: 'High',
              affectedSystems: 3,
              recommendedVersion: '2.4.58'
            },
            {
              id: 2,
              serviceName: 'MySQL Database',
              version: '8.0.25',
              port: 3306,
              protocol: 'TCP',
              riskLevel: 'high',
              cveIds: ['CVE-2024-9012'],
              patchStatus: 'in-progress',
              cvssScore: '7.5',
              exploitability: 'Medium',
              affectedSystems: 2,
              recommendedVersion: '8.0.35'
            },
            {
              id: 3,
              serviceName: 'OpenSSH',
              version: '7.4',
              port: 22,
              protocol: 'SSH',
              riskLevel: 'medium',
              cveIds: ['CVE-2024-3456', 'CVE-2024-7890'],
              patchStatus: 'completed',
              cvssScore: '5.3',
              exploitability: 'Low',
              affectedSystems: 5,
              recommendedVersion: '9.0'
            }
          ];
          setVulnerabilities(mockVulnerabilities);
          setRiskMetrics({
            totalVulnerabilities: mockVulnerabilities.length,
            criticalRisk: 1,
            highRisk: 1,
            mediumRisk: 1,
            lowRisk: 0
          });
        }
        
      } catch (err) {
        console.error('Error loading scan results:', err);
        setError('Failed to load vulnerability data');
        // Fallback to mock data
        const mockVulnerabilities = [
          {
            id: 1,
            serviceName: 'No Scan Data',
            version: 'N/A',
            port: 0,
            protocol: 'N/A',
            riskLevel: 'low',
            cveIds: [],
            patchStatus: 'no-patch',
            cvssScore: '0.0',
            exploitability: 'None',
            affectedSystems: 0,
            recommendedVersion: 'N/A'
          }
        ];
        setVulnerabilities(mockVulnerabilities);
      } finally {
        setLoading(false);
      }
    };

    loadScanResults();
  }, [user?.id]);

  // Filter vulnerabilities based on active filters and search
  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        vuln.serviceName.toLowerCase().includes(searchLower) ||
        vuln.cveIds.some(cve => cve.toLowerCase().includes(searchLower)) ||
        vuln.port.toString().includes(searchLower) ||
        vuln.riskLevel.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Risk level filter
    if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(vuln.riskLevel)) {
      return false;
    }

    // Service type filter (simplified mapping)
    if (filters.serviceTypes.length > 0) {
      const serviceTypeMap = {
        'web': ['Apache HTTP Server', 'Nginx'],
        'database': ['MySQL Database', 'PostgreSQL', 'Redis'],
        'ssh': ['OpenSSH'],
        'ftp': [],
        'mail': []
      };
      
      const matchesServiceType = filters.serviceTypes.some(type => 
        serviceTypeMap[type]?.includes(vuln.serviceName)
      );
      
      if (!matchesServiceType) return false;
    }

    // Patch status filter
    if (filters.patchStatuses.length > 0 && !filters.patchStatuses.includes(vuln.patchStatus)) {
      return false;
    }

    // Port range filter
    if (filters.portRanges.length > 0) {
      const matchesPortRange = filters.portRanges.some(range => {
        const [min, max] = range.split('-').map(Number);
        return vuln.port >= min && vuln.port <= max;
      });
      
      if (!matchesPortRange) return false;
    }

    return true;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      riskLevels: [],
      serviceTypes: [],
      patchStatuses: [],
      portRanges: []
    });
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
  }

  const handleBulkAction = (action) => {
    switch (action) {
      case 'mark-progress': console.log('Marking selected items as in progress:', selectedItems);
        // Update vulnerability status
        setVulnerabilities(prev => 
          prev.map(vuln => 
            selectedItems.includes(vuln.id) 
              ? { ...vuln, patchStatus: 'in-progress' }
              : vuln
          )
        );
        setSelectedItems([]);
        break;
      case 'mark-completed':
        console.log('Marking selected items as completed:', selectedItems);
        setVulnerabilities(prev => 
          prev.map(vuln => 
            selectedItems.includes(vuln.id) 
              ? { ...vuln, patchStatus: 'completed' }
              : vuln
          )
        );
        setSelectedItems([]);
        break;
      case 'export':
        console.log('Exporting selected items:', selectedItems);
        break;
      case 'export-all':
        console.log('Exporting all vulnerabilities');
        break;
      case 'refresh-scan': console.log('Refreshing vulnerability scan');
        break;
      case 'generate-report': console.log('Generating vulnerability report');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        
        {/* Main Content */}
        <div className="flex-1 p-6 pt-20">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Vulnerabilities</h1>
              <p className="text-muted-foreground">
                Manage and track security vulnerabilities across your infrastructure
              </p>
            </div>

            {/* Risk Metrics */}
            <RiskMetrics onRiskLevelClick={handleRiskLevelClick} />

            {/* Search and Actions */}
            <SearchAndActions
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onBulkAction={handleBulkAction}
              selectedCount={selectedItems.length}
            />

            {/* Filter Chips */}
            <FilterChips
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
            />

            {/* Vulnerability Table */}
            <VulnerabilityTable
              vulnerabilities={filteredVulnerabilities}
              onBulkAction={handleBulkAction}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VulnerabilitiesPage;