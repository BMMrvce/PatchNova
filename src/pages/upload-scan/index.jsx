import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FileUploadZone from './components/FileUploadZone';
import FileDetails from './components/FileDetails';
import ProcessingStatus from './components/ProcessingStatus';
import SampleDownload from './components/SampleDownload';
import OpenAITest from './components/OpenAITest';
import ErrorDisplay from './components/ErrorDisplay';
import Icon from '../../components/AppIcon';
import fileUploadService from '../../utils/fileUploadService';
import openaiService from '../../services/openaiService';

const UploadScan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, uploaded, processing, error, completed
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(1);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [fileUploadId, setFileUploadId] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [apiStats, setApiStats] = useState(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);
  const [liveData, setLiveData] = useState(null);

  // Test OpenAI connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      if (user?.id) {
        setIsTestingConnection(true);
        try {
          console.log('🔍 Testing OpenAI API connection...');
          const connectionTest = await openaiService.testConnection();
          
          if (connectionTest.success) {
            console.log('✅ OpenAI API connection successful');
          } else {
            console.error('❌ OpenAI API connection failed:', connectionTest.error);
            setError(`API Connection Failed: ${connectionTest.error}`);
          }
          
          // Get initial API stats
          setApiStats(openaiService.getApiStats());
          
        } catch (error) {
          console.error('❌ Connection test error:', error);
          setError(`Connection test failed: ${error.message}`);
        } finally {
          setIsTestingConnection(false);
        }
      }
    };

    testConnection();
  }, [user?.id]);

  // Simulate file upload progress
  useEffect(() => {
    if (uploadState === 'uploading' && user?.id) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadState('uploaded');
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [uploadState, user?.id]);

  const handleFileSelect = async (file, errorMessage) => {
    if (errorMessage) {
      setError(errorMessage);
      setUploadState('error');
      return;
    }

    if (file && user?.id) {
      setSelectedFile(file);
      setUploadProgress(0);
      setUploadState('uploading');
      setError(null);

      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);

      // Log file upload
      const logResult = await fileUploadService.logFileUpload(user.id, {
        name: file.name,
        size: file.size,
        type: file.type,
        path: `/uploads/${file.name}`
      });

      if (logResult?.success) {
        setFileUploadId(logResult.data.id);
      }
    }
  };

  const updateFileUploadStatus = async (status, details = {}) => {
    if (fileUploadId) {
      await fileUploadService.updateFileUploadStatus(fileUploadId, status, details);
    }
  };

  const createScanResult = async (analysisData) => {
    if (fileUploadId && user?.id) {
      const result = await fileUploadService.logScanResult(fileUploadId, user.id, analysisData);
      if (result?.success && result?.data?.id) {
        await fileUploadService.updateScanStatus(result.data.id, 'completed', new Date().toISOString());
        return result.data.id;
      }
    }
    return null;
  };

  const handleProcessScan = async () => {
    try {
      setUploadState('processing');
      setProcessingStep(1);
      setProcessingProgress(0);
      setError(null);

      console.log('🚀 Starting scan processing...');
      
      // Update file upload status to processing
      await updateFileUploadStatus('processing');

      // Step 1: Parsing XML data
      setProcessingStep(1);
      setProcessingProgress(10);
      
      if (!fileContent) {
        throw new Error('No file content to analyze');
      }

      console.log('📄 File content length:', fileContent.length, 'characters');

      // Step 2: Analyzing with OpenAI
      setProcessingStep(2);
      setProcessingProgress(30);
      
      console.log('🤖 Starting AI analysis...');
      const analysisResult = await openaiService.analyzeXMLFile(fileContent);
      console.log('✅ AI analysis completed:', analysisResult);

      // Set live data so ProcessingStatus can show real values
      setLiveData(analysisResult);

      // Add debug info
      setDebugInfo(prev => [...prev, {
        step: 'Analysis',
        timestamp: new Date().toISOString(),
        success: true,
        data: analysisResult
      }]);

      // Update API stats after analysis
      setApiStats(openaiService.getApiStats());
      
      // Step 3: Generating AI recommendations
      setProcessingStep(3);
      setProcessingProgress(70);
      
      console.log('💡 Generating recommendations...');
      const recommendations = await openaiService.generateRecommendations(analysisResult.vulnerabilities);
      console.log('✅ Recommendations generated:', recommendations);
      
      // Add debug info
      setDebugInfo(prev => [...prev, {
        step: 'Recommendations',
        timestamp: new Date().toISOString(),
        success: true,
        data: recommendations
      }]);
      
      // Update API stats after recommendations
      setApiStats(openaiService.getApiStats());
      
      // Step 4: Finalizing report
      setProcessingStep(4);
      setProcessingProgress(90);
      
      const finalData = {
        ...analysisResult,
        recommendations: recommendations,
        scanDuration: Date.now() - Date.now(),
        timestamp: new Date().toISOString(),
        apiStats: openaiService.getApiStats() // Include API stats in final data
      };

      console.log('📊 Final scan data:', finalData);

      // Complete processing
      setProcessingProgress(100);
      setUploadState('completed');
      
      // Update file upload status and create scan result
      await updateFileUploadStatus('completed');
      await createScanResult(finalData);
      
      console.log('🎉 Scan processing completed successfully!');
      
      // Navigate to reports page to see the latest scan
      setTimeout(() => {
        navigate('/reports', { state: { fromScan: true } });
      }, 2000);

    } catch (error) {
      console.error('❌ Processing error:', error);
      
      // Add debug info for error
      setDebugInfo(prev => [...prev, {
        step: 'Error',
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message,
        stack: error.stack
      }]);
      
      // Update API stats even on error
      setApiStats(openaiService.getApiStats());
      
      // Provide more detailed error information
      let errorMessage = `Analysis failed: ${error.message}`;
      
      if (error.message.includes('API key')) {
        errorMessage = 'OpenAI API key is missing or invalid. Please check your environment configuration.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'API rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      setUploadState('error');
      await updateFileUploadStatus('error', { errorMessage: error.message });
    }
  };

  const handleUploadAnother = () => {
    setUploadState('idle');
    setSelectedFile(null);
    setUploadProgress(0);
    setProcessingStep(1);
    setProcessingProgress(0);
    setError(null);
    setFileUploadId(null);
    setFileContent('');
    setDebugInfo([]);
    setLiveData(null);
  };

  const handleRetry = async () => {
    if (selectedFile) {
      setUploadProgress(0);
      setUploadState('uploaded');
      setError(null);
      
      // Update file upload status
      await updateFileUploadStatus('uploaded');
    } else {
      setUploadState('idle');
      setError(null);
    }
  };

  const renderContent = () => {
    switch (uploadState) {
      case 'idle': case'uploading':
        return (
          <FileUploadZone
            onFileSelect={handleFileSelect}
            isUploading={uploadState === 'uploading'}
            uploadProgress={uploadProgress}
          />
        );
      
      case 'uploaded':
        return (
          <FileDetails
            file={selectedFile}
            onProcess={handleProcessScan}
            onUploadAnother={handleUploadAnother}
            isProcessing={false}
          />
        );
      
      case 'processing':
        return (
          <ProcessingStatus
            currentStep={processingStep}
            progress={processingProgress}
            liveData={liveData}
          />
        );
      
      case 'completed':
        return (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-card border border-success/20 rounded-lg p-6 shadow-elevation-1 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-success/10 rounded-full mb-4">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Scan Analyzed Successfully!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your XML file has been analyzed by AI. Redirecting to reports...
              </p>
              {liveData && (
                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="bg-muted/40 rounded-md p-2">
                    <div className="font-semibold text-foreground">{liveData.totalVulnerabilities ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Vulnerabilities</div>
                  </div>
                  <div className="bg-muted/40 rounded-md p-2">
                    <div className="font-semibold text-destructive">{liveData.criticalRisk ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Critical</div>
                  </div>
                  <div className="bg-muted/40 rounded-md p-2">
                    <div className="font-semibold text-foreground">{liveData.hostsScanned ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Hosts</div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Loader2" size={16} className="animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Redirecting...</span>
              </div>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <ErrorDisplay
            error={error}
            onRetry={handleRetry}
            onUploadAnother={handleUploadAnother}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-6 py-8">
          <Breadcrumb />
          
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name="Upload" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Upload Scan</h1>
                <p className="text-sm text-muted-foreground">
                  Upload your Nmap XML files for AI-powered vulnerability analysis
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {renderContent()}
            
            {/* API Status Panel for Development */}
            {(apiStats && process.env.NODE_ENV === 'development') && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={apiStats.isConnected ? "Wifi" : "WifiOff"} 
                        size={16} 
                        className={apiStats.isConnected ? "text-success" : "text-destructive"} 
                      />
                      <h4 className="text-sm font-semibold text-foreground">
                        OpenAI API Status
                      </h4>
                    </div>
                    
                    <button
                      onClick={async () => {
                        setIsTestingConnection(true);
                        try {
                          const testResult = await openaiService.testConnection();
                          setApiStats(openaiService.getApiStats());
                          setDebugInfo(prev => [...prev, {
                            step: 'Connection Test',
                            timestamp: new Date().toISOString(),
                            success: testResult.success,
                            data: testResult
                          }]);
                        } catch (error) {
                          setDebugInfo(prev => [...prev, {
                            step: 'Connection Test',
                            timestamp: new Date().toISOString(),
                            success: false,
                            error: error.message
                          }]);
                        } finally {
                          setIsTestingConnection(false);
                        }
                      }}
                      disabled={isTestingConnection}
                      className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/80 disabled:opacity-50"
                    >
                      {isTestingConnection ? 'Testing...' : 'Test API'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Connection:</span>
                      <span className={`ml-1 font-medium ${
                        apiStats.isConnected ? 'text-success' : 'text-destructive'
                      }`}>
                        {apiStats.isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Total Calls:</span>
                      <span className="ml-1 font-medium text-foreground">
                        {apiStats.totalCalls}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="ml-1 font-medium text-foreground">
                        {apiStats.successRate}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Tokens Used:</span>
                      <span className="ml-1 font-medium text-foreground">
                        {apiStats.totalTokensUsed}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Avg Response:</span>
                      <span className="ml-1 font-medium text-foreground">
                        {apiStats.averageResponseTime}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Failed Calls:</span>
                      <span className="ml-1 font-medium text-destructive">
                        {apiStats.failedCalls}
                      </span>
                    </div>
                  </div>
                  
                  {isTestingConnection && (
                    <div className="mt-3 flex items-center space-x-2 text-xs text-muted-foreground">
                      <Icon name="Loader2" size={12} className="animate-spin" />
                      <span>Testing API connection...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Debug Panel for Development */}
            {(debugInfo.length > 0 && process.env.NODE_ENV === 'development') && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="Bug" size={16} className="text-warning" />
                    <h4 className="text-sm font-semibold text-foreground">
                      Debug Information
                    </h4>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {debugInfo.map((info, index) => (
                      <div key={index} className="bg-muted/30 border border-border rounded p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon 
                            name={info.success ? "CheckCircle" : "XCircle"} 
                            size={14} 
                            className={info.success ? "text-success" : "text-destructive"} 
                          />
                          <span className="text-xs font-medium text-foreground">
                            {info.step}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(info.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        {info.success ? (
                          <div className="text-xs text-muted-foreground">
                            <div className="font-mono bg-card border border-border rounded p-2 mt-2 max-h-32 overflow-y-auto">
                              {JSON.stringify(info.data, null, 2)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-destructive">
                            <div className="font-medium">{info.error}</div>
                            {info.stack && (
                              <div className="font-mono bg-card border border-border rounded p-2 mt-2 max-h-32 overflow-y-auto text-xs">
                                {info.stack}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {(uploadState === 'idle' || uploadState === 'error') && (
              <>
                <SampleDownload />
                <div className="mt-6">
                  <OpenAITest />
                </div>
              </>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-muted/30 border border-border rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg flex-shrink-0">
                  <Icon name="HelpCircle" size={20} className="text-accent" />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    How to generate Nmap XML files
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>
                      Use the following Nmap command to generate XML output:
                    </p>
                    <div className="bg-card border border-border rounded p-3 font-mono text-xs">
                      nmap -sV -O -oX scan_results.xml target_ip
                    </div>
                    <ul className="space-y-1 list-disc list-inside ml-2">
                      <li><strong>-sV:</strong> Version detection</li>
                      <li><strong>-O:</strong> OS detection</li>
                      <li><strong>-oX:</strong> XML output format</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadScan;