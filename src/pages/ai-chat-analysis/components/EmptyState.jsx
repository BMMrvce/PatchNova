import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ onUploadScan, onStartDemo }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-6 mx-auto">
          <Icon name="MessageSquare" size={32} className="text-muted-foreground" />
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Start Your Security Analysis
        </h2>
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Upload a scan file or start with our demo data to begin interactive analysis with AI. 
          Ask questions about vulnerabilities, get patch recommendations, and explore security insights.
        </p>
        
        {/* <div className="space-y-3">
          <Button
            variant="default"
            size="lg"
            iconName="Upload"
            iconPosition="left"
            onClick={onUploadScan}
            fullWidth
          >
            Upload Scan File
          </Button> 
        */}
          
        <Button
          variant="warning"
          size="lg"
          iconName="Play"
          iconPosition="left"
          onClick={onStartDemo}
          fullWidth
        >
          Try Analysis
        </Button>
        
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-2">
            What you can ask:
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            <li>• "Show me the most critical vulnerabilities"</li>
            <li>• "What patches should I prioritize?"</li>
            <li>• "Explain the risk of CVE-2023-1234"</li>
            <li>• "Which services are outdated?"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;