import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MessageBubble from './components/MessageBubble';
import SuggestedQueries from './components/SuggestedQueries';
import ChatInput from './components/ChatInput';
import ChatHeader from './components/ChatHeader';
import EmptyState from './components/EmptyState';
import ScrollToTop from '../../components/ScrollToTop';
import fileUploadService from '../../utils/fileUploadService';
import claudeService from '../../services/claudeService';;

const AIChatAnalysis = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentScan, setCurrentScan] = useState(null);
  const [scanContext, setScanContext] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);

  // Load the most recent scan from Supabase to use as AI context
  useEffect(() => {
    const loadLatestScan = async () => {
      if (!user?.id) return;
      setLoadingContext(true);
      try {
        const result = await fileUploadService.getScanResults(user.id, 1);
        if (result?.success && result.data?.length > 0) {
          const latest = result.data[0];
          const data = latest.scan_data || {};
          setCurrentScan({
            name: latest.file_upload_logs?.file_name ?? 'Latest scan',
            vulnerabilities: data.totalVulnerabilities ?? latest.vulnerabilities_found ?? 0,
            criticalCount: data.criticalRisk ?? 0,
            highCount: data.highRisk ?? latest.high_risk_count ?? 0,
            mediumCount: data.mediumRisk ?? latest.medium_risk_count ?? 0,
            lowCount: data.lowRisk ?? latest.low_risk_count ?? 0,
            hostsScanned: data.hostsScanned ?? 0,
            services: data.servicesIdentified ?? 0,
            scanDate: latest.created_at
          });
          setScanContext({
            fileName: latest.file_upload_logs?.file_name ?? 'Unknown',
            totalVulnerabilities: data.totalVulnerabilities ?? latest.vulnerabilities_found ?? 0,
            criticalRisk: data.criticalRisk ?? 0,
            highRisk: data.highRisk ?? latest.high_risk_count ?? 0,
            mediumRisk: data.mediumRisk ?? latest.medium_risk_count ?? 0,
            lowRisk: data.lowRisk ?? latest.low_risk_count ?? 0,
            hostsScanned: data.hostsScanned ?? 0,
            servicesIdentified: data.servicesIdentified ?? 0,
            summary: data.summary ?? null,
            vulnerabilities: data.vulnerabilities ?? [],
            recommendations: data.recommendations ?? null,
            scanDetails: data.scanDetails ?? null
          });
        }
      } catch (err) {
        console.error('Failed to load scan context:', err);
      } finally {
        setLoadingContext(false);
      }
    };

    loadLatestScan();
  }, [user?.id]);

  // Auto-scroll to bottom on new messages or streaming updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: messageText,
      isUser: true,
      timestamp: new Date()
    };

    // Build conversation history for the API (all turns so far)
    const historyForApi = messages.map(m => ({
      role: m.isUser ? 'user' : 'assistant',
      content: m.content
    }));
    historyForApi.push({ role: 'user', content: messageText });

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add an empty placeholder AI message that we'll stream into
    const aiMessageId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true
    }]);

    try {
      const stream = await claudeService.streamChatAnalysis(historyForApi, scanContext);

      let fullContent = '';
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          const delta = event.delta.text;
          if (delta) {
            fullContent += delta;
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, content: fullContent } : msg
              )
            );
          }
        }
      }

      // Mark streaming done
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err) {
      console.error('AI chat error:', err);
      const errorText = err.message?.includes('API key') || err.message?.includes('api_key')
        ? 'Anthropic API key is missing or invalid. Please check your environment configuration.'
        : err.message?.includes('rate limit')
          ? 'API rate limit reached. Please wait a moment and try again.'
          : `Error: ${err.message}`;

      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: errorText, isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
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
    handleSendMessage('Give me an overview of the vulnerabilities found in this scan and the top actions I should take.');
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
                      isStreaming={message.isStreaming}
                    />
                  ))}

                  {/* Show typing indicator only before the streaming message appears */}
                  {isLoading && messages[messages.length - 1]?.isUser && (
                    <MessageBubble isLoading={true} />
                  )}
                </div>

                {/* Suggested queries shown below messages when chat is short */}
                {messages.length <= 2 && !isLoading && (
                  <div className="px-6 py-3 border-t border-border">
                    <SuggestedQueries
                      onQuerySelect={handleQuerySelect}
                      disabled={isLoading}
                    />
                  </div>
                )}
              </>
            )}

            {/* Chat Input */}
            <div className="border-t border-border">
              {!currentScan && !loadingContext && (
                <div className="px-6 pt-3 text-xs text-muted-foreground text-center">
                  No scan loaded — AI will answer general cybersecurity questions.{' '}
                  <button onClick={handleUploadScan} className="text-primary underline">
                    Upload a scan
                  </button>{' '}
                  to get context-aware analysis.
                </div>
              )}
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                disabled={false}
              />
            </div>
          </div>

          <ScrollToTop containerRef={chatContainerRef} />
        </div>
      </main>
    </div>
  );
};

export default AIChatAnalysis;
