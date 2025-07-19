import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ onFileSelect, isUploading, uploadProgress }) => {
  const [dragActive, setDragActive] = useState(false);

  // Validate XML file structure
  const validateXMLFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          
          // Check if it's a valid XML document
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(content, 'text/xml');
          
          // Check for parsing errors
          const parserError = xmlDoc.querySelector('parsererror');
          if (parserError) {
            reject('Invalid XML format: ' + parserError.textContent);
            return;
          }
          
          // Check if it's an nmap XML file
          const nmaprun = xmlDoc.querySelector('nmaprun');
          if (!nmaprun) {
            reject('This is not a valid Nmap XML file. Please upload an Nmap XML scan result.');
            return;
          }
          
          // Check for hosts or scaninfo
          const hosts = xmlDoc.querySelectorAll('host');
          const scaninfo = xmlDoc.querySelector('scaninfo');
          
          if (!scaninfo && hosts.length === 0) {
            reject('This Nmap XML file appears to be empty or corrupted. Please upload a valid scan result.');
            return;
          }
          
          resolve(true);
        } catch (error) {
          reject('Failed to parse XML file: ' + error.message);
        }
      };
      
      reader.onerror = () => {
        reject('Failed to read the file');
      };
      
      reader.readAsText(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      let errorMessage = 'Invalid file selected';
      
      if (error.code === 'file-invalid-type') {
        errorMessage = 'Only XML files are supported';
      } else if (error.code === 'file-too-large') {
        errorMessage = 'File size must be less than 50MB';
      }
      
      onFileSelect(null, errorMessage);
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      try {
        // Validate XML structure
        await validateXMLFile(file);
        onFileSelect(file, null);
      } catch (validationError) {
        onFileSelect(null, validationError);
      }
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/xml': ['.xml'],
      'application/xml': ['.xml']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    disabled: isUploading
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragActive || dragActive
            ? 'border-primary bg-primary/5 scale-105' :'border-border hover:border-primary/50 hover:bg-muted/30'
        } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
              <Icon name="Upload" size={32} className="text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">Uploading...</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
              <Icon name="Upload" size={32} className="text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? 'Drop XML files here' : 'Drag XML files here or click to browse'}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports XML files up to 50MB
              </p>
            </div>
            <Button variant="outline" className="mt-4">
              <Icon name="FolderOpen" size={16} className="mr-2" />
              Browse Files
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;