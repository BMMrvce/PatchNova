import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileDetails = ({ file, onProcess, onUploadAnother, isProcessing }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg flex-shrink-0">
            <Icon name="FileText" size={24} className="text-success" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              File Uploaded Successfully
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">File Name:</span>
                <span className="text-foreground font-medium truncate ml-2">
                  {file.name}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">File Size:</span>
                <span className="text-foreground font-medium">
                  {formatFileSize(file.size)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Upload Time:</span>
                <span className="text-foreground font-medium">
                  {formatDate(new Date())}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">File Type:</span>
                <span className="text-foreground font-medium">XML</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
          <Button 
            variant="default" 
            onClick={onProcess}
            loading={isProcessing}
            className="flex-1"
            iconName="Play"
            iconPosition="left"
          >
            {isProcessing ? 'Processing Scan...' : 'Process Scan'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onUploadAnother}
            disabled={isProcessing}
            className="flex-1"
            iconName="Upload"
            iconPosition="left"
          >
            Upload Another
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;