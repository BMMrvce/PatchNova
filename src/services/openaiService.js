import OpenAI from 'openai';

class OpenAIService {
  constructor() {
    // Initialize OpenAI client
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Required for client-side usage
    });
    
    // Track API calls for monitoring
    this.apiCallCount = 0;
    this.apiCallHistory = [];
    this.isConnected = false;
  }

  // Test API connection
  async testConnection() {
    try {
      console.log('🔍 Testing OpenAI API connection...');
      
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Test connection. Respond with 'API working'"
          }
        ],
        max_tokens: 50
      });

      this.isConnected = true;
      console.log('✅ OpenAI API connection successful');
      return { success: true, response: response.choices[0].message.content };
      
    } catch (error) {
      this.isConnected = false;
      console.error('❌ OpenAI API connection failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Track API call with detailed logging
  trackApiCall(endpoint, requestData, responseData, duration) {
    this.apiCallCount++;
    const callInfo = {
      id: this.apiCallCount,
      timestamp: new Date().toISOString(),
      endpoint,
      requestData: {
        model: requestData.model,
        tokensRequested: requestData.max_tokens,
        promptLength: requestData.messages?.reduce((acc, msg) => acc + msg.content.length, 0) || 0
      },
      responseData: {
        tokensUsed: responseData.usage?.total_tokens || 0,
        promptTokens: responseData.usage?.prompt_tokens || 0,
        completionTokens: responseData.usage?.completion_tokens || 0,
        responseLength: responseData.choices?.[0]?.message?.content?.length || 0
      },
      duration,
      success: true
    };

    this.apiCallHistory.push(callInfo);
    
    // Log to console for debugging
    console.log('📊 API Call Tracked:', {
      callNumber: callInfo.id,
      endpoint: callInfo.endpoint,
      duration: `${duration}ms`,
      tokensUsed: callInfo.responseData.tokensUsed,
      promptTokens: callInfo.responseData.promptTokens,
      completionTokens: callInfo.responseData.completionTokens
    });

    return callInfo;
  }

  // Track failed API call
  trackFailedApiCall(endpoint, requestData, error, duration) {
    this.apiCallCount++;
    const callInfo = {
      id: this.apiCallCount,
      timestamp: new Date().toISOString(),
      endpoint,
      requestData: {
        model: requestData.model,
        tokensRequested: requestData.max_tokens,
        promptLength: requestData.messages?.reduce((acc, msg) => acc + msg.content.length, 0) || 0
      },
      error: error.message,
      duration,
      success: false
    };

    this.apiCallHistory.push(callInfo);
    
    console.error('❌ API Call Failed:', {
      callNumber: callInfo.id,
      endpoint: callInfo.endpoint,
      error: error.message,
      duration: `${duration}ms`
    });

    return callInfo;
  }

  // Analyze XML file with comprehensive tracking
  async analyzeXMLFile(xmlContent) {
    const startTime = Date.now();
    
    try {
      console.log('🔍 Starting XML analysis...');
      console.log('📄 XML Content Length:', xmlContent.length, 'characters');
      
      const requestData = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a cybersecurity expert specializing in Nmap scan analysis. 
            Analyze the provided XML data and extract vulnerability information.
            IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.
            Do not wrap your response in \`\`\`json or any other markdown.`
          },
          {
            role: "user",
            content: `Analyze this Nmap XML scan data and provide a comprehensive vulnerability assessment based on the actual services and versions found.

XML Data:
${xmlContent}

Based on the scan results, identify real vulnerabilities for the detected services and versions. Look for:
- Outdated software versions with known CVEs
- Default configurations
- Exposed administrative interfaces
- Insecure protocols
- Missing security headers
- Weak encryption

Return ONLY this JSON structure (no markdown, no code blocks):
{
  "totalVulnerabilities": number,
  "criticalRisk": number,
  "highRisk": number,
  "mediumRisk": number,
  "lowRisk": number,
  "vulnerabilities": [
    {
      "id": "VULN-001",
      "title": "Descriptive vulnerability title",
      "severity": "critical|high|medium|low",
      "description": "Detailed description of the vulnerability",
      "host": "IP address from scan",
      "port": "Port number",
      "service": "Service name (ssh, http, etc)",
      "protocol": "tcp|udp",
      "product": "Product name and version",
      "cve": "CVE-YYYY-NNNN or null",
      "cvssScore": 7.5,
      "impact": "Potential impact description",
      "remediation": "Specific remediation steps",
      "exploitability": "high|medium|low",
      "affectedVersion": "Version range affected"
    }
  ],
  "summary": "Executive summary of findings",
  "hostsScanned": number,
  "portsFound": number,
  "servicesIdentified": number,
  "scanDetails": {
    "scanType": "Service and OS detection",
    "scanDuration": "40 seconds",
    "targetRange": "Single host scan"
  }
}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      };

      const response = await this.client.chat.completions.create(requestData);
      const duration = Date.now() - startTime;
      
      // Track successful API call
      this.trackApiCall('analyzeXMLFile', requestData, response, duration);
      
      // Clean the response content to extract JSON
      let responseContent = response.choices[0].message.content.trim();
      console.log('🔍 Raw AI Response:', responseContent);
      
      // Remove markdown code blocks if present (enhanced cleaning)
      if (responseContent.includes('```json')) {
        responseContent = responseContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      } else if (responseContent.includes('```')) {
        responseContent = responseContent.replace(/```\s*/g, '');
      }
      
      // Additional cleaning for common AI response patterns
      responseContent = responseContent
        .replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1') // Extract JSON object
        .replace(/\n\s*\n/g, '\n') // Remove extra newlines
        .trim();
      
      // Try to parse JSON
      let analysisResult;
      try {
        analysisResult = JSON.parse(responseContent);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.error('🔍 Content to parse:', responseContent);
        
        // Try to extract JSON from the response using regex
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysisResult = JSON.parse(jsonMatch[0]);
            console.log('✅ Successfully extracted JSON using regex');
          } catch (regexParseError) {
            throw new Error(`Failed to parse AI response as JSON. Raw response: ${responseContent.substring(0, 200)}...`);
          }
        } else {
          throw new Error(`AI response does not contain valid JSON. Raw response: ${responseContent.substring(0, 200)}...`);
        }
      }
      
      console.log('✅ XML Analysis completed successfully');
      console.log('📊 Analysis Summary:', {
        totalVulnerabilities: analysisResult.totalVulnerabilities,
        hostsScanned: analysisResult.hostsScanned,
        duration: `${duration}ms`
      });
      
      return analysisResult;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Track failed API call
      this.trackFailedApiCall('analyzeXMLFile', { 
        model: "gpt-3.5-turbo", 
        max_tokens: 2000,
        messages: [{ content: `XML content (${xmlContent.length} chars)` }]
      }, error, duration);
      
      console.error('❌ XML Analysis failed:', error);
      throw new Error(`XML analysis failed: ${error.message}`);
    }
  }

  // Generate recommendations with tracking
  async generateRecommendations(vulnerabilities) {
    const startTime = Date.now();
    
    try {
      console.log('💡 Generating AI recommendations...');
      console.log('🔍 Processing', vulnerabilities?.length || 0, 'vulnerabilities');
      
      const requestData = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a cybersecurity consultant providing actionable remediation recommendations.
            Generate prioritized recommendations based on vulnerability data.
            IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.
            Do not wrap your response in \`\`\`json or any other markdown.`
          },
          {
            role: "user",
            content: `Based on these vulnerabilities, provide detailed remediation recommendations.

Vulnerabilities:
${JSON.stringify(vulnerabilities, null, 2)}

Return ONLY this JSON structure (no markdown, no code blocks):
{
  "priority": "immediate|high|medium|low",
  "recommendations": [
    {
      "category": "patch_management|configuration|network_security|access_control",
      "title": "string",
      "description": "string",
      "steps": ["step1", "step2", "step3"],
      "timeframe": "immediate|days|weeks|months",
      "difficulty": "easy|medium|hard",
      "cost": "free|low|medium|high"
    }
  ],
  "summary": "string",
  "riskScore": number
}`
          }
        ],
        max_tokens: 1500,
        temperature: 0.4
      };

      const response = await this.client.chat.completions.create(requestData);
      const duration = Date.now() - startTime;
      
      // Track successful API call
      this.trackApiCall('generateRecommendations', requestData, response, duration);
      
      // Clean the response content to extract JSON
      let responseContent = response.choices[0].message.content.trim();
      console.log('🔍 Raw Recommendations Response:', responseContent);
      
      // Remove markdown code blocks if present
      if (responseContent.startsWith('```json')) {
        responseContent = responseContent.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (responseContent.startsWith('```')) {
        responseContent = responseContent.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }
      
      // Try to parse JSON
      let recommendations;
      try {
        recommendations = JSON.parse(responseContent);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.error('🔍 Content to parse:', responseContent);
        
        // Try to extract JSON from the response using regex
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            recommendations = JSON.parse(jsonMatch[0]);
            console.log('✅ Successfully extracted JSON using regex');
          } catch (regexParseError) {
            throw new Error(`Failed to parse recommendations response as JSON. Raw response: ${responseContent.substring(0, 200)}...`);
          }
        } else {
          throw new Error(`Recommendations response does not contain valid JSON. Raw response: ${responseContent.substring(0, 200)}...`);
        }
      }
      
      console.log('✅ Recommendations generated successfully');
      console.log('📊 Recommendations Summary:', {
        priority: recommendations.priority,
        recommendationCount: recommendations.recommendations?.length || 0,
        duration: `${duration}ms`
      });
      
      return recommendations;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Track failed API call
      this.trackFailedApiCall('generateRecommendations', {
        model: "gpt-3.5-turbo",
        max_tokens: 1500,
        messages: [{ content: `Vulnerabilities data (${vulnerabilities?.length || 0} items)` }]
      }, error, duration);
      
      console.error('❌ Recommendations generation failed:', error);
      throw new Error(`Recommendations generation failed: ${error.message}`);
    }
  }

  // Get API usage statistics
  getApiStats() {
    const totalCalls = this.apiCallHistory.length;
    const successfulCalls = this.apiCallHistory.filter(call => call.success).length;
    const failedCalls = totalCalls - successfulCalls;
    const totalTokensUsed = this.apiCallHistory
      .filter(call => call.success)
      .reduce((acc, call) => acc + (call.responseData.tokensUsed || 0), 0);
    const averageResponseTime = totalCalls > 0 
      ? this.apiCallHistory.reduce((acc, call) => acc + call.duration, 0) / totalCalls 
      : 0;

    return {
      isConnected: this.isConnected,
      totalCalls,
      successfulCalls,
      failedCalls,
      successRate: totalCalls > 0 ? (successfulCalls / totalCalls * 100).toFixed(2) + '%' : '0%',
      totalTokensUsed,
      averageResponseTime: Math.round(averageResponseTime) + 'ms',
      lastCall: totalCalls > 0 ? this.apiCallHistory[totalCalls - 1] : null
    };
  }

  // Get recent API call history
  getRecentApiCalls(limit = 10) {
    return this.apiCallHistory
      .slice(-limit)
      .reverse(); // Most recent first
  }
}

// Create singleton instance
const openaiService = new OpenAIService();

export default openaiService;
