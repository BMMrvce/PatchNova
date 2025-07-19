import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MessageBubble from './components/MessageBubble';
import SuggestedQueries from './components/SuggestedQueries';
import ChatInput from './components/ChatInput';
import ChatHeader from './components/ChatHeader';
import EmptyState from './components/EmptyState';
import ScrollToTop from '../../components/ScrollToTop';

const AIChatAnalysis = () => {
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentScan, setCurrentScan] = useState(null);

  // Mock current scan data
  const mockScanData = {
    name: "network_scan_2025-01-11.xml",
    services: 47,
    vulnerabilities: 23,
    criticalCount: 5,
    highCount: 8,
    mediumCount: 7,
    lowCount: 3
  };

  // Mock AI responses
  const mockAIResponses = {
    "Show critical vulnerabilities": `**Critical Vulnerabilities Found (5 total)**

**1. CVE-2023-4911 - GNU C Library Buffer Overflow**
- **Severity**: Critical (CVSS 9.8)
- **Affected Service**: SSH (Port 22)
- **Impact**: Remote code execution
- **Recommendation**: Update glibc to version 2.38-1 or later

**2. CVE-2023-38408 - OpenSSH Remote Code Execution**
- **Severity**: Critical (CVSS 9.8)
- **Affected Service**: SSH (Port 22)
- **Impact**: Authentication bypass and RCE
- **Recommendation**: Upgrade OpenSSH to version 9.4p1 or later

**3. CVE-2023-32681 - Apache HTTP Server Path Traversal**
- **Severity**: Critical (CVSS 9.1)
- **Affected Service**: HTTP (Port 80, 443)
- **Impact**: Directory traversal and file disclosure
- **Recommendation**: Update Apache to version 2.4.57 or later

**Priority Actions:**
1. **Immediate**: Patch SSH services (affects 12 hosts)
2. **High**: Update Apache servers (affects 8 hosts)
3. **Medium**: Review firewall rules for exposed services

Would you like me to provide detailed remediation steps for any of these vulnerabilities?`,

    "Recommend patch priority": `**Patch Priority Recommendations**

**🔴 IMMEDIATE (Within 24 hours)**
1. **SSH Services** - 12 affected hosts
   - CVE-2023-4911, CVE-2023-38408
   - Risk: Remote code execution
   - Patch window: Schedule during maintenance window

2. **Apache Web Servers** - 8 affected hosts
   - CVE-2023-32681
   - Risk: Data exposure
   - Patch window: Rolling updates recommended

**🟡 HIGH PRIORITY (Within 1 week)**
3. **MySQL Databases** - 5 affected hosts
   - CVE-2023-21980
   - Risk: Privilege escalation
   - Patch window: Coordinate with application teams

4. **DNS Servers** - 3 affected hosts
   - CVE-2023-50387
   - Risk: Service disruption
   - Patch window: Staggered updates

**🟢 MEDIUM PRIORITY (Within 2 weeks)**
5. **FTP Services** - 7 affected hosts
   - CVE-2023-1234
   - Risk: Information disclosure
   - Patch window: Standard maintenance

**Patching Strategy:**
- Test patches in staging environment first
- Implement monitoring during patch deployment
- Prepare rollback procedures for critical services
- Coordinate with business stakeholders for downtime windows

Would you like me to generate a detailed patching schedule or provide specific commands for any service?`,

    "Explain CVE impact": `**CVE Impact Analysis**

Let me explain the impact of the most critical CVEs found in your scan:

**CVE-2023-4911 - GNU C Library Buffer Overflow**
- **Technical Impact**: Stack-based buffer overflow in the dynamic loader
- **Attack Vector**: Remote exploitation through crafted environment variables
- **Business Impact**: 
  - Complete system compromise possible
  - Potential data breach affecting customer information
  - Service disruption across multiple systems
- **Affected Assets**: 12 SSH-enabled servers
- **Exploitation Complexity**: Low (public exploits available)

**CVE-2023-38408 - OpenSSH Remote Code Execution**
- **Technical Impact**: Authentication bypass leading to RCE
- **Attack Vector**: Network-based attack against SSH service
- **Business Impact**:
  - Unauthorized access to critical infrastructure
  - Lateral movement within network
  - Potential compliance violations (SOX, PCI-DSS)
- **Affected Assets**: All SSH servers (12 hosts)
- **Exploitation Complexity**: Medium (requires network access)

**Risk Assessment Matrix:**
\`\`\`
Vulnerability    | Likelihood | Impact | Risk Score
CVE-2023-4911   | High       | High   | Critical
CVE-2023-38408  | Medium     | High   | High
CVE-2023-32681  | High       | Medium | High
\`\`\`

**Mitigation Recommendations:**
1. **Immediate**: Implement network segmentation
2. **Short-term**: Deploy patches during next maintenance window
3. **Long-term**: Enhance vulnerability management processes

Would you like me to provide specific remediation steps or create a risk register for these vulnerabilities?`,

    "List outdated services": `**Outdated Services Analysis**

**🔴 CRITICAL - End of Life Services**
1. **Apache HTTP Server 2.4.41** (8 hosts)
   - Current: 2.4.41 | Latest: 2.4.58
   - Gap: 17 versions behind
   - Security patches: 23 missing
   - **Action**: Immediate upgrade required

2. **OpenSSH 8.2** (12 hosts)
   - Current: 8.2 | Latest: 9.5
   - Gap: 13 versions behind
   - Security patches: 15 missing
   - **Action**: Critical security update needed

**🟡 HIGH PRIORITY - Significantly Outdated**
3. **MySQL 8.0.25** (5 hosts)
   - Current: 8.0.25 | Latest: 8.0.35
   - Gap: 10 versions behind
   - Security patches: 8 missing
   - **Action**: Schedule upgrade within 1 week

4. **BIND DNS 9.16.1** (3 hosts)
   - Current: 9.16.1 | Latest: 9.18.20
   - Gap: Major version behind
   - Security patches: 12 missing
   - **Action**: Plan major version upgrade

**🟢 MEDIUM PRIORITY - Minor Updates Available**
5. **vsftpd 3.0.3** (7 hosts)
   - Current: 3.0.3 | Latest: 3.0.5
   - Gap: 2 versions behind
   - Security patches: 3 missing
   - **Action**: Standard maintenance update

**Service Update Timeline:**
\`\`\`
Week 1: Apache HTTP, OpenSSH (Critical)
Week 2: MySQL (High Priority)
Week 3: BIND DNS (High Priority)  
Week 4: vsftpd (Medium Priority)
\`\`\`

**Automation Recommendations:**
- Implement automated patch management
- Set up vulnerability scanning schedules
- Create service inventory tracking
- Establish update approval workflows

Would you like me to generate specific update commands or create a maintenance schedule for these services?`,

    "Generate risk summary": `**Security Risk Summary Report**

**Executive Overview**
Your network scan reveals **23 vulnerabilities** across **47 services** with a **High Risk** security posture requiring immediate attention.

**Risk Distribution**
\`\`\`
Critical: ████████████ 5 (22%)
High:     ████████████████ 8 (35%)
Medium:   ██████████ 7 (30%)
Low:      ████ 3 (13%)
\`\`\`

**Key Risk Indicators**
- **Risk Score**: 7.8/10 (High)
- **Exposure Level**: 67% of services have known vulnerabilities
- **Patch Compliance**: 33% services up-to-date
- **Time to Remediation**: 2-4 weeks estimated

**Top Risk Categories**
1. **Remote Code Execution** - 8 vulnerabilities
   - Impact: Complete system compromise
   - Affected: SSH, HTTP, Database services
   
2. **Privilege Escalation** - 6 vulnerabilities
   - Impact: Unauthorized access elevation
   - Affected: System services, Applications
   
3. **Information Disclosure** - 5 vulnerabilities
   - Impact: Data breach potential
   - Affected: Web services, File shares

**Business Impact Assessment**
- **Financial Risk**: $2.5M - $5M potential loss
- **Compliance Risk**: PCI-DSS, SOX violations possible
- **Operational Risk**: 72-hour service disruption potential
- **Reputation Risk**: Customer trust impact

**Immediate Actions Required**
1. **Emergency Patching** (24-48 hours)
   - SSH services: 12 hosts
   - Web servers: 8 hosts
   
2. **Network Segmentation** (This week)
   - Isolate critical services
   - Implement access controls
   
3. **Monitoring Enhancement** (Next week)
   - Deploy security monitoring
   - Enable threat detection

**Recommended Next Steps**
- Schedule emergency maintenance window
- Engage security incident response team
- Prepare stakeholder communications
- Implement temporary mitigations

Would you like me to generate a detailed remediation plan or create executive briefing materials?`,

    "Show port vulnerabilities": `**Port-Based Vulnerability Analysis**

**🔴 HIGH RISK PORTS**

**Port 22 (SSH) - 12 hosts exposed**
- **CVE-2023-4911**: GNU C Library Buffer Overflow (Critical)
- **CVE-2023-38408**: OpenSSH RCE (Critical)
- **Risk Level**: Critical
- **Recommendation**: Immediate patching + restrict access

**Port 80/443 (HTTP/HTTPS) - 8 hosts exposed**
- **CVE-2023-32681**: Apache Path Traversal (Critical)
- **CVE-2023-44487**: HTTP/2 Rapid Reset (High)
- **Risk Level**: High
- **Recommendation**: Update Apache + implement WAF

**Port 3306 (MySQL) - 5 hosts exposed**
- **CVE-2023-21980**: MySQL Privilege Escalation (High)
- **CVE-2023-21962**: MySQL DoS (Medium)
- **Risk Level**: High
- **Recommendation**: Database patching + network isolation

**🟡 MEDIUM RISK PORTS**

**Port 53 (DNS) - 3 hosts exposed**
- **CVE-2023-50387**: BIND KeyTrap DoS (Medium)
- **Risk Level**: Medium
- **Recommendation**: DNS server updates

**Port 21 (FTP) - 7 hosts exposed**
- **CVE-2023-1234**: vsftpd Information Disclosure (Medium)
- **Risk Level**: Medium
- **Recommendation**: Consider SFTP migration

**Port Exposure Matrix**
\`\`\`
Port  | Service | Hosts | Vulns | Risk Level
22    | SSH     | 12    | 2     | Critical
80    | HTTP    | 8     | 2     | High
443   | HTTPS   | 8     | 2     | High
3306  | MySQL   | 5     | 2     | High
53    | DNS     | 3     | 1     | Medium
21    | FTP     | 7     | 1     | Medium
\`\`\`

**Network Security Recommendations**
1. **Firewall Rules**: Restrict SSH access to management networks
2. **Port Scanning**: Regular automated scanning schedule
3. **Service Hardening**: Disable unnecessary services
4. **Access Control**: Implement least privilege principles
5. **Monitoring**: Deploy port-based intrusion detection

**Immediate Actions**
- Close unnecessary ports on public interfaces
- Implement port-based access controls
- Schedule vulnerability patching by port priority
- Review service configurations for hardening opportunities

Would you like me to provide specific firewall rules or create a port hardening checklist?`
  };

  useEffect(() => {
    // Simulate loading current scan data
    setCurrentScan(mockScanData);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (messageText) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      content: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: mockAIResponses[messageText] || `I understand you're asking about "${messageText}". Based on your current scan data, I can provide detailed analysis of vulnerabilities, patch recommendations, and security insights.\n\nHere are some key points I can help you with:\n\n**Vulnerability Analysis**\n- Critical vulnerabilities requiring immediate attention\n- Risk assessment and impact analysis\n- Patch priority recommendations\n\n**Security Insights**\n- Service configuration recommendations\n- Network security improvements\n- Compliance gap analysis\n\nWould you like me to focus on any specific aspect of your security posture?`,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleQuerySelect = (query) => {
    handleSendMessage(query);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExportChat = () => {
    const chatData = {
      scan: currentScan?.name || 'No scan loaded',
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUploadScan = () => {
    navigate('/upload-scan');
  };

  const handleStartDemo = () => {
    // Start with a demo message
    const demoMessage = "Show critical vulnerabilities";
    handleSendMessage(demoMessage);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          {/* Chat Header */}
          <ChatHeader
            currentScan={currentScan}
            onClearChat={handleClearChat}
            onExportChat={handleExportChat}
            messageCount={messages.length}
          />

          {/* Breadcrumb */}
          <div className="px-6 py-4 border-b border-border">
            <Breadcrumb />
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!hasMessages && !isLoading ? (
              <EmptyState
                onUploadScan={handleUploadScan}
                onStartDemo={handleStartDemo}
              />
            ) : (
              <>
                {/* Messages Area */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4"
                >
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                    />
                  ))}
                  
                  {isLoading && (
                    <MessageBubble isLoading={true} />
                  )}
                </div>

                {/* Suggested Queries */}
                {!hasMessages && !isLoading && (
                  <div className="px-6 py-4 border-t border-border">
                    <SuggestedQueries
                      onQuerySelect={handleQuerySelect}
                      disabled={isLoading}
                    />
                  </div>
                )}
              </>
            )}

            {/* Chat Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={!currentScan}
            />
          </div>

          {/* Scroll to Top */}
          <ScrollToTop containerRef={chatContainerRef} />
        </div>
      </main>
    </div>
  );
};

export default AIChatAnalysis;