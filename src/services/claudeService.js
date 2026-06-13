import Anthropic from '@anthropic-ai/sdk';

const MODEL = import.meta.env.VITE_CLAUDE_MODEL || 'claude-haiku-4-5-20251001';

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true
    });

    this.apiCallCount = 0;
    this.apiCallHistory = [];
    this.isConnected = false;
  }

  async testConnection() {
    try {
      console.log('🔍 Testing Claude API connection...');

      const response = await this.client.messages.create({
        model: MODEL,
        system: 'You are a helpful assistant.',
        messages: [{ role: 'user', content: "Test connection. Respond with 'API working'" }],
        max_tokens: 50
      });

      this.isConnected = true;
      console.log('✅ Claude API connection successful');
      return { success: true, response: response.content[0].text };

    } catch (error) {
      this.isConnected = false;
      console.error('❌ Claude API connection failed:', error);
      return { success: false, error: error.message };
    }
  }

  trackApiCall(endpoint, requestData, responseData, duration) {
    this.apiCallCount++;
    const callInfo = {
      id: this.apiCallCount,
      timestamp: new Date().toISOString(),
      endpoint,
      requestData: {
        model: requestData.model,
        tokensRequested: requestData.max_tokens,
        promptLength: requestData.messages?.reduce((acc, msg) => acc + (typeof msg.content === 'string' ? msg.content.length : 0), 0) || 0
      },
      responseData: {
        tokensUsed: (responseData.usage?.input_tokens || 0) + (responseData.usage?.output_tokens || 0),
        promptTokens: responseData.usage?.input_tokens || 0,
        completionTokens: responseData.usage?.output_tokens || 0,
        responseLength: responseData.content?.[0]?.text?.length || 0
      },
      duration,
      success: true
    };

    this.apiCallHistory.push(callInfo);

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

  trackFailedApiCall(endpoint, requestData, error, duration) {
    this.apiCallCount++;
    const callInfo = {
      id: this.apiCallCount,
      timestamp: new Date().toISOString(),
      endpoint,
      requestData: {
        model: requestData.model,
        tokensRequested: requestData.max_tokens,
        promptLength: requestData.messages?.reduce((acc, msg) => acc + (typeof msg.content === 'string' ? msg.content.length : 0), 0) || 0
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

  async analyzeXMLFile(xmlContent) {
    const startTime = Date.now();

    try {
      console.log('🔍 Starting XML analysis...');
      console.log('📄 XML Content Length:', xmlContent.length, 'characters');

      const systemPrompt = `You are a cybersecurity expert specializing in Nmap scan analysis.
Analyze the provided XML data and extract vulnerability information.
IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.
Do not wrap your response in \`\`\`json or any other markdown.`;

      const userPrompt = `Analyze this Nmap XML scan data and provide a comprehensive vulnerability assessment based on the actual services and versions found.

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
}`;

      const requestData = {
        model: MODEL,
        max_tokens: 8000,
        messages: [{ role: 'user', content: userPrompt }]
      };

      const response = await this.client.messages.create({
        ...requestData,
        system: systemPrompt
      });

      const duration = Date.now() - startTime;
      this.trackApiCall('analyzeXMLFile', requestData, response, duration);

      let responseContent = response.content[0].text.trim();
      console.log('🔍 Raw AI Response:', responseContent);

      if (responseContent.startsWith('```json')) {
        responseContent = responseContent.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (responseContent.startsWith('```')) {
        responseContent = responseContent.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }

      let analysisResult;
      try {
        analysisResult = JSON.parse(responseContent);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.error('🔍 Content to parse:', responseContent);

        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysisResult = JSON.parse(jsonMatch[0]);
            console.log('✅ Successfully extracted JSON using regex');
          } catch {
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

      this.trackFailedApiCall('analyzeXMLFile', {
        model: MODEL,
        max_tokens: 8000,
        messages: [{ content: `XML content (${xmlContent.length} chars)` }]
      }, error, duration);

      console.error('❌ XML Analysis failed:', error);
      throw new Error(`XML analysis failed: ${error.message}`);
    }
  }

  async generateRecommendations(vulnerabilities) {
    const startTime = Date.now();

    try {
      console.log('💡 Generating AI recommendations...');
      console.log('🔍 Processing', vulnerabilities?.length || 0, 'vulnerabilities');

      const systemPrompt = `You are a cybersecurity consultant providing actionable remediation recommendations.
Generate prioritized recommendations based on vulnerability data.
IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.
Do not wrap your response in \`\`\`json or any other markdown.`;

      const userPrompt = `Based on these vulnerabilities, provide detailed remediation recommendations.

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
}`;

      const requestData = {
        model: MODEL,
        max_tokens: 4000,
        messages: [{ role: 'user', content: userPrompt }]
      };

      const response = await this.client.messages.create({
        ...requestData,
        system: systemPrompt
      });

      const duration = Date.now() - startTime;
      this.trackApiCall('generateRecommendations', requestData, response, duration);

      let responseContent = response.content[0].text.trim();
      console.log('🔍 Raw Recommendations Response:', responseContent);

      if (responseContent.startsWith('```json')) {
        responseContent = responseContent.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (responseContent.startsWith('```')) {
        responseContent = responseContent.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }

      let recommendations;
      try {
        recommendations = JSON.parse(responseContent);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            recommendations = JSON.parse(jsonMatch[0]);
            console.log('✅ Successfully extracted JSON using regex');
          } catch {
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

      this.trackFailedApiCall('generateRecommendations', {
        model: MODEL,
        max_tokens: 1500,
        messages: [{ content: `Vulnerabilities data (${vulnerabilities?.length || 0} items)` }]
      }, error, duration);

      console.error('❌ Recommendations generation failed:', error);
      throw new Error(`Recommendations generation failed: ${error.message}`);
    }
  }

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

  getRecentApiCalls(limit = 10) {
    return this.apiCallHistory.slice(-limit).reverse();
  }

  async streamChatAnalysis(conversationHistory, scanContext = null) {
    const contextBlock = scanContext
      ? `\n\nCurrent scan context loaded:
- File: ${scanContext.fileName || 'Unknown'}
- Total Vulnerabilities: ${scanContext.totalVulnerabilities ?? 0}
- Critical: ${scanContext.criticalRisk ?? 0} | High: ${scanContext.highRisk ?? 0} | Medium: ${scanContext.mediumRisk ?? 0} | Low: ${scanContext.lowRisk ?? 0}
- Hosts Scanned: ${scanContext.hostsScanned ?? 0}
- Services Identified: ${scanContext.servicesIdentified ?? 0}
- Scan Summary: ${scanContext.summary || 'N/A'}

Top vulnerabilities from scan:
${JSON.stringify((scanContext.vulnerabilities || []).slice(0, 15), null, 2)}`
      : '\n\nNo scan has been loaded yet. Provide general cybersecurity guidance when asked.';

    const systemPrompt = `You are PatchNova AI, an expert cybersecurity analyst assistant embedded in the PatchNova vulnerability management platform. Your role is to help security teams understand and remediate vulnerabilities found in their Nmap network scans.

You have deep expertise in:
- CVE analysis and CVSS scoring
- Network service hardening (SSH, HTTP, databases, DNS, FTP, etc.)
- Patch prioritisation and remediation planning
- Compliance frameworks (NIST, PCI-DSS, ISO 27001, SOC 2)
- Risk assessment and executive reporting

When answering:
- Be specific and actionable, referencing actual data from the scan context
- Format responses with markdown (bold, bullet lists, code blocks) for readability
- Prioritise findings by severity and exploitability
- Provide concrete commands or config changes where relevant${contextBlock}`;

    const stream = await this.client.messages.create({
      model: MODEL,
      system: systemPrompt,
      messages: conversationHistory,
      stream: true,
      max_tokens: 1500
    });

    return stream;
  }
}

const claudeService = new ClaudeService();
export default claudeService;
