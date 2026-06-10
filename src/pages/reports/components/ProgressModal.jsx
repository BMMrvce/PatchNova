import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressModal = ({ isOpen, onClose, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(45);

  const steps = [
    { id: 0, title: 'Initializing Report Generation', description: 'Setting up report configuration...' },
    { id: 1, title: 'Processing Scan Data', description: 'Analyzing vulnerability data and risk metrics...' },
    { id: 2, title: 'Generating AI Analysis', description: 'Creating intelligent recommendations and insights...' },
    { id: 3, title: 'Building Report Structure', description: 'Organizing content and formatting sections...' },
    { id: 4, title: 'Creating Visualizations', description: 'Generating charts and risk distribution graphs...' },
    { id: 5, title: 'Finalizing PDF Document', description: 'Compiling final report and optimizing for download...' },
    { id: 6, title: 'Report Complete', description: 'Your report is ready for download!' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      setEstimatedTime(45);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 3 + 1;
        
        // Update current step based on progress
        const stepProgress = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepProgress, steps.length - 1));
        
        // Update estimated time
        const remaining = Math.max(0, Math.ceil((100 - newProgress) * 0.5));
        setEstimatedTime(remaining);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 100;
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen, onComplete, steps.length]);

  if (!isOpen) return null;

  const isComplete = progress >= 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                {isComplete ? (
                  <Icon name="Check" size={20} color="white" />
                ) : (
                  <Icon name="FileText" size={20} color="white" />
                )}
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {isComplete ? 'Report Generated!' : 'Generating Report'}
              </h2>
            </div>
            {isComplete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                iconName="X"
              />
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {Math.round(progress)}% Complete
              </span>
              {!isComplete && (
                <span className="text-sm text-muted-foreground">
                  ~{estimatedTime}s remaining
                </span>
              )}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {currentStep === steps.length - 1 ? (
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} color="white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground mb-1">
                  {steps[currentStep]?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {steps[currentStep]?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-2 mb-6">
            {steps.slice(0, -1).map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-3 text-sm ${
                  index < currentStep
                    ? 'text-success'
                    : index === currentStep
                    ? 'text-primary' :'text-muted-foreground'
                }`}
              >
                <div className="flex-shrink-0">
                  {index < currentStep ? (
                    <Icon name="Check" size={16} />
                  ) : index === currentStep ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-muted-foreground/30 rounded-full" />
                  )}
                </div>
                <span className="truncate">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          {isComplete && (
            <div className="flex items-center space-x-3">
              <Button
                variant="default"
                fullWidth
                onClick={onClose}
                iconName="Download"
                iconPosition="left"
              >
                Download Report
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                iconName="Eye"
                iconPosition="left"
              >
                Preview
              </Button>
            </div>
          )}

          {/* Cancel Button for In-Progress */}
          {!isComplete && (
            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
              iconName="X"
              iconPosition="left"
            >
              Cancel Generation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;