import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SampleDownload = () => {
  const handleDownloadSample = () => {
    // Create sample XML content
    const sampleXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE nmaprun>
<nmaprun scanner="nmap" args="nmap -sV -O target" start="1720675349" startstr="Thu Jul 11 06:15:49 2024" version="7.94" xmloutputversion="1.05">
  <scaninfo type="syn" protocol="tcp" numservices="1000" services="1-1000"/>
  <verbose level="0"/>
  <debugging level="0"/>
  <host starttime="1720675349" endtime="1720675389">
    <status state="up" reason="echo-reply" reason_ttl="64"/>
    <address addr="192.168.1.100" addrtype="ipv4"/>
    <hostnames>
      <hostname name="server.example.com" type="PTR"/>
    </hostnames>
    <ports>
      <port protocol="tcp" portid="22">
        <state state="open" reason="syn-ack" reason_ttl="64"/>
        <service name="ssh" product="OpenSSH" version="7.4" extrainfo="protocol 2.0" method="probed" conf="10">
          <cpe>cpe:/a:openbsd:openssh:7.4</cpe>
        </service>
      </port>
      <port protocol="tcp" portid="80">
        <state state="open" reason="syn-ack" reason_ttl="64"/>
        <service name="http" product="Apache httpd" version="2.4.6" extrainfo="(CentOS)" method="probed" conf="10">
          <cpe>cpe:/a:apache:http_server:2.4.6</cpe>
        </service>
      </port>
      <port protocol="tcp" portid="443">
        <state state="open" reason="syn-ack" reason_ttl="64"/>
        <service name="https" product="Apache httpd" version="2.4.6" extrainfo="(CentOS) OpenSSL/1.0.2k" method="probed" conf="10">
          <cpe>cpe:/a:apache:http_server:2.4.6</cpe>
        </service>
      </port>
    </ports>
    <os>
      <portused state="open" proto="tcp" portid="22"/>
      <osmatch name="Linux 3.2 - 4.9" accuracy="95" line="54321">
        <osclass type="general purpose" vendor="Linux" osfamily="Linux" osgen="3.X" accuracy="95">
          <cpe>cpe:/o:linux:linux_kernel:3</cpe>
        </osclass>
      </osmatch>
    </os>
  </host>
  <runstats>
    <finished time="1720675389" timestr="Thu Jul 11 06:16:29 2024" elapsed="40.12" summary="Nmap done at Thu Jul 11 06:16:29 2024; 1 IP address (1 host up) scanned in 40.12 seconds" exit="success"/>
  </runstats>
</nmaprun>`;

    // Create and download the file
    const blob = new Blob([sampleXmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-nmap-scan.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg flex-shrink-0">
            <Icon name="Download" size={20} className="text-accent" />
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-foreground mb-1">
              Need a sample XML file?
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Download our sample Nmap XML file to understand the required format and test the upload functionality.
            </p>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadSample}
              iconName="Download"
              iconPosition="left"
            >
              Download Sample XML
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDownload;