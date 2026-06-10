import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ChatHeader = ({ currentScan, onClearChat, onExportChat, messageCount }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
      onClearChat();
    }
    setIsDropdownOpen(false);
  };

  const handleExportChat = () => {
    onExportChat();
    setIsDropdownOpen(false);
  };

  return (
    <div className="border-b border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="MessageSquare" size={20} className="text-primary" />
          </div>
          
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Chat Analysis</h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {currentScan ? (
                <>
                  <Icon name="FileText" size={14} />
                  <span>Analyzing: {currentScan.name}</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {currentScan.services} services
                  </span>
                </>
              ) : (
                <>
                  <Icon name="Upload" size={14} />
                  <span>No scan loaded - Upload a scan to start analysis</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Message count */}
          {messageCount > 0 && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              <Icon name="MessageCircle" size={14} />
              <span>{messageCount} messages</span>
            </div>
          )}
          
          {/* Actions dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreVertical"
              iconSize={16}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Actions
            </Button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-elevation-3 z-50">
                <div className="py-1">
                  <button
                    onClick={handleExportChat}
                    disabled={messageCount === 0}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-micro disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Export Chat
                  </button>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-micro"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    AI Settings
                  </button>
                  <div className="border-t border-border">
                    <button
                      onClick={handleClearChat}
                      disabled={messageCount === 0}
                      className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-muted transition-micro disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Clear Chat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside handler */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;