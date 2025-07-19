import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessingStatus = ({ currentStep, progress }) => {
  const steps = [
    { id: 1, label: 'Parsing XML data', icon: 'FileSearch' },
    { id: 2, label: 'Analyzing vulnerabilities', icon: 'Shield' },
    { id: 3, label: 'Generating AI recommendations', icon: 'Brain' },
    { id: 4, label: 'Finalizing report', icon: 'CheckCircle' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full mb-4">
            <Icon name="Loader2" size={32} className="text-primary animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Processing Your Scan
          </h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we analyze your XML file
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                step.id < currentStep 
                  ? 'bg-success text-success-foreground' 
                  : step.id === currentStep 
                    ? 'bg-primary text-primary-foreground animate-pulse' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {step.id < currentStep ? (
                  <Icon name="Check" size={16} />
                ) : step.id === currentStep ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <Icon name={step.icon} size={16} />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  step.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </p>
              </div>
              
              {step.id < currentStep && (
                <Icon name="CheckCircle" size={16} className="text-success" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="text-foreground font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;