import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, filterCounts }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const riskLevels = [
    { value: 'critical', label: 'Critical', color: 'bg-red-500', count: filterCounts?.riskLevels?.critical || 0 },
    { value: 'high', label: 'High', color: 'bg-orange-500', count: filterCounts?.riskLevels?.high || 0 },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', count: filterCounts?.riskLevels?.medium || 0 },
    { value: 'low', label: 'Low', color: 'bg-green-500', count: filterCounts?.riskLevels?.low || 0 }
  ];

  const serviceTypes = [
    { value: 'web', label: 'Web Services', count: filterCounts?.serviceTypes?.web || 0 },
    { value: 'database', label: 'Database', count: filterCounts?.serviceTypes?.database || 0 },
    { value: 'network', label: 'Network Services', count: filterCounts?.serviceTypes?.network || 0 },
    { value: 'application', label: 'Application Services', count: filterCounts?.serviceTypes?.application || 0 },
    { value: 'system', label: 'System Services', count: filterCounts?.serviceTypes?.system || 0 }
  ];

  const patchStatuses = [
    { value: 'available', label: 'Patch Available', count: filterCounts?.patchStatuses?.available || 0 },
    { value: 'in-progress', label: 'In Progress', count: filterCounts?.patchStatuses?.['in-progress'] || 0 },
    { value: 'completed', label: 'Completed', count: filterCounts?.patchStatuses?.completed || 0 },
    { value: 'no-patch', label: 'No Patch Available', count: filterCounts?.patchStatuses?.['no-patch'] || 0 }
  ];

  const portRanges = [
    { value: '1-1023', label: 'Well-known (1-1023)', count: filterCounts?.portRanges?.['1-1023'] || 0 },
    { value: '1024-49151', label: 'Registered (1024-49151)', count: filterCounts?.portRanges?.['1024-49151'] || 0 },
    { value: '49152-65535', label: 'Dynamic (49152-65535)', count: filterCounts?.portRanges?.['49152-65535'] || 0 }
  ];

  const handleRiskLevelChange = (value, checked) => {
    const newRiskLevels = checked 
      ? [...filters.riskLevels, value]
      : filters.riskLevels.filter(level => level !== value);
    onFilterChange({ ...filters, riskLevels: newRiskLevels });
  };

  const handleServiceTypeChange = (value, checked) => {
    const newServiceTypes = checked 
      ? [...filters.serviceTypes, value]
      : filters.serviceTypes.filter(type => type !== value);
    onFilterChange({ ...filters, serviceTypes: newServiceTypes });
  };

  const handlePatchStatusChange = (value, checked) => {
    const newPatchStatuses = checked 
      ? [...filters.patchStatuses, value]
      : filters.patchStatuses.filter(status => status !== value);
    onFilterChange({ ...filters, patchStatuses: newPatchStatuses });
  };

  const handlePortRangeChange = (value, checked) => {
    const newPortRanges = checked 
      ? [...filters.portRanges, value]
      : filters.portRanges.filter(range => range !== value);
    onFilterChange({ ...filters, portRanges: newPortRanges });
  };

  const getActiveFiltersCount = () => {
    return filters.riskLevels.length + filters.serviceTypes.length + 
           filters.patchStatuses.length + filters.portRanges.length;
  };

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    } lg:w-80`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-primary" />
            {!isCollapsed && (
              <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {getActiveFiltersCount() > 0 && !isCollapsed && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-muted rounded-md transition-micro lg:hidden"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </button>
          </div>
        </div>
        
        {!isCollapsed && getActiveFiltersCount() > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="mt-3 w-full"
            iconName="X"
            iconPosition="left"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Risk Level Filter */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Risk Level</h4>
            <div className="space-y-2">
              {riskLevels.map((level) => (
                <div key={level.value} className="flex items-center justify-between">
                  <Checkbox
                    label={
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`} />
                        <span className="text-sm">{level.label}</span>
                      </div>
                    }
                    checked={filters.riskLevels.includes(level.value)}
                    onChange={(e) => handleRiskLevelChange(level.value, e.target.checked)}
                  />
                  <span className="text-xs text-muted-foreground">{level.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Type Filter */}
          {/* <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Service Type</h4>
            <div className="space-y-2">
              {serviceTypes.map((service) => (
                <div key={service.value} className="flex items-center justify-between">
                  <Checkbox
                    label={service.label}
                    checked={filters.serviceTypes.includes(service.value)}
                    onChange={(e) => handleServiceTypeChange(service.value, e.target.checked)}
                  />
                  <span className="text-xs text-muted-foreground">{service.count}</span>
                </div>
              ))}
            </div>
          </div> */}

          {/* Patch Status Filter */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Patch Status</h4>
            <div className="space-y-2">
              {patchStatuses.map((status) => (
                <div key={status.value} className="flex items-center justify-between">
                  <Checkbox
                    label={status.label}
                    checked={filters.patchStatuses.includes(status.value)}
                    onChange={(e) => handlePatchStatusChange(status.value, e.target.checked)}
                  />
                  <span className="text-xs text-muted-foreground">{status.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Port Range Filter */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Port Range</h4>
            <div className="space-y-2">
              {portRanges.map((range) => (
                <div key={range.value} className="flex items-center justify-between">
                  <Checkbox
                    label={range.label}
                    checked={filters.portRanges.includes(range.value)}
                    onChange={(e) => handlePortRangeChange(range.value, e.target.checked)}
                  />
                  <span className="text-xs text-muted-foreground">{range.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;