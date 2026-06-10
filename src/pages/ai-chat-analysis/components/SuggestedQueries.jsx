import React from 'react';
import Button from '../../../components/ui/Button';

const SuggestedQueries = ({ onQuerySelect, disabled }) => {
  const suggestedQueries = [
    {
      id: 1,
      text: "Show critical vulnerabilities",
      icon: "AlertTriangle",
      category: "Analysis"
    },
    {
      id: 2,
      text: "Recommend patch priority",
      icon: "Target",
      category: "Recommendations"
    },
    {
      id: 3,
      text: "Explain CVE impact",
      icon: "Info",
      category: "Details"
    },
    {
      id: 4,
      text: "List outdated services",
      icon: "Clock",
      category: "Services"
    },
    {
      id: 5,
      text: "Generate risk summary",
      icon: "BarChart3",
      category: "Reports"
    },
    {
      id: 6,
      text: "Show port vulnerabilities",
      icon: "Shield",
      category: "Network"
    }
  ];

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Suggested queries:</h3>
      <div className="flex flex-wrap gap-2">
        {suggestedQueries.map((query) => (
          <Button
            key={query.id}
            variant="outline"
            size="sm"
            disabled={disabled}
            iconName={query.icon}
            iconPosition="left"
            iconSize={14}
            onClick={() => onQuerySelect(query.text)}
            className="text-xs"
          >
            {query.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQueries;