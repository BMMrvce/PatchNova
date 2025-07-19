import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ filters, onRemoveFilter }) => {
  const getFilterChips = () => {
    const chips = [];
    
    // Risk Level chips
    filters.riskLevels.forEach(level => {
      chips.push({
        type: 'riskLevel',
        value: level,
        label: `Risk: ${level.charAt(0).toUpperCase() + level.slice(1)}`,
        color: level === 'critical' ? 'bg-red-100 text-red-800 border-red-200' :
               level === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
               level === 'medium'? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-green-100 text-green-800 border-green-200'
      });
    });
    
    // Service Type chips
    filters.serviceTypes.forEach(type => {
      chips.push({
        type: 'serviceType',
        value: type,
        label: `Service: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      });
    });
    
    // Patch Status chips
    filters.patchStatuses.forEach(status => {
      chips.push({
        type: 'patchStatus',
        value: status,
        label: `Status: ${status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      });
    });
    
    // Port Range chips
    filters.portRanges.forEach(range => {
      chips.push({
        type: 'portRange',
        value: range,
        label: `Ports: ${range}`,
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      });
    });
    
    return chips;
  };

  const chips = getFilterChips();

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="text-sm text-muted-foreground self-center">Active filters:</span>
      {chips.map((chip, index) => (
        <div
          key={`${chip.type}-${chip.value}-${index}`}
          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${chip.color}`}
        >
          <span>{chip.label}</span>
          <button
            onClick={() => onRemoveFilter(chip.type, chip.value)}
            className="hover:bg-black/10 rounded-full p-0.5 transition-micro"
          >
            <Icon name="X" size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilterChips;