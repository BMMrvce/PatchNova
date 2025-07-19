import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import openaiService from '../../../services/openaiService';

const OpenAITest = () => {
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleTestOpenAI = async () => {
    setIsTestingAPI(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing OpenAI API...');
      
      // Test connection first
      const connectionTest = await openaiService.testConnection();
      
      if (!connectionTest.success) {
        setTestResult({
          success: false,
          error: `Connection failed: ${connectionTest.error}`,
          type: 'connection'
        });
        return;
      }

      // Test with sample vulnerability data
      const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<nmaprun scanner="nmap" version="7.94">
  <host>
    <status state="up"/>
    <address addr="192.168.1.100" addrtype="ipv4"/>
    <ports>
      <port protocol="tcp" portid="22">
        <state state="open"/>
        <service name="ssh" product="OpenSSH" version="7.4"/>
      </port>
      <port protocol="tcp" portid="80">
        <state state="open"/>
        <service name="http" product="Apache httpd" version="2.4.6"/>
      </port>
    </ports>
  </host>
</nmaprun>`;

      console.log('🔍 Testing vulnerability analysis...');
      const analysisResult = await openaiService.analyzeXMLFile(sampleXML);
      
      setTestResult({
        success: true,
        data: analysisResult,
        type: 'analysis',
        apiStats: openaiService.getApiStats()
      });
      
    } catch (error) {
      console.error('❌ OpenAI test failed:', error);
      setTestResult({
        success: false,
        error: error.message,
        type: 'analysis'
      });
    } finally {
      setIsTestingAPI(false);
    }
  };

  const getStatusIcon = () => {
    if (isTestingAPI) return "RotateCcw";
    if (!testResult) return "Zap";
    return testResult.success ? "CheckCircle" : "XCircle";
  };

  const getStatusColor = () => {
    if (isTestingAPI) return "text-blue-500";
    if (!testResult) return "text-accent";
    return testResult.success ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg flex-shrink-0">
            <Icon 
              name={getStatusIcon()} 
              size={20} 
              className={`${getStatusColor()} ${isTestingAPI ? 'animate-spin' : ''}`} 
            />
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-foreground mb-1">
              Test OpenAI Integration
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Verify that OpenAI API is working and test vulnerability analysis with sample data.
            </p>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTestOpenAI}
                disabled={isTestingAPI}
                iconName={isTestingAPI ? "RotateCcw" : "Zap"}
                iconPosition="left"
                className={isTestingAPI ? "animate-pulse" : ""}
              >
                {isTestingAPI ? "Testing..." : "Test OpenAI API"}
              </Button>
              
              {testResult && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  iconName={showDetails ? "ChevronUp" : "ChevronDown"}
                  iconPosition="right"
                >
                  {showDetails ? "Hide" : "Show"} Details
                </Button>
              )}
            </div>

            {/* Test Results */}
            {testResult && (
              <div className={`mt-4 p-3 rounded-lg border ${
                testResult.success 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Icon 
                    name={testResult.success ? "CheckCircle" : "XCircle"} 
                    size={16} 
                    className={testResult.success ? "text-green-600" : "text-red-600"} 
                  />
                  <span className={`text-sm font-medium ${
                    testResult.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                  }`}>
                    {testResult.success ? "✅ OpenAI API Working!" : "❌ Test Failed"}
                  </span>
                </div>
                
                {testResult.success ? (
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Successfully analyzed sample data and found {testResult.data?.totalVulnerabilities || 0} vulnerabilities.
                    API calls made: {testResult.apiStats?.totalCalls || 0}
                  </p>
                ) : (
                  <p className="text-xs text-red-700 dark:text-red-300">
                    {testResult.error}
                  </p>
                )}

                {/* Detailed Results */}
                {showDetails && testResult.success && testResult.data && (
                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="text-green-800 dark:text-green-200">
                          <span className="font-medium">Total Vulnerabilities:</span> {testResult.data.totalVulnerabilities}
                        </div>
                        <div className="text-green-800 dark:text-green-200">
                          <span className="font-medium">Critical:</span> {testResult.data.criticalRisk || 0}
                        </div>
                        <div className="text-green-800 dark:text-green-200">
                          <span className="font-medium">High:</span> {testResult.data.highRisk || 0}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-green-800 dark:text-green-200">
                          <span className="font-medium">Hosts Scanned:</span> {testResult.data.hostsScanned || 1}
                        </div>
                        <div className="text-green-800 dark:text-green-200">
                          <span className="font-medium">Services:</span> {testResult.data.servicesIdentified || 0}
                        </div>
                        <div className="text-green-800 dark:text-green-200">
                          <span className="font-medium">API Response:</span> ✅ Valid JSON
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAITest;
