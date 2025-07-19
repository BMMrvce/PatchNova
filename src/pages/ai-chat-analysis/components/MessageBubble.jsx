import React from 'react';
import Icon from '../../../components/AppIcon';

const MessageBubble = ({ message, isUser, timestamp, isLoading }) => {
  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const renderMarkdownContent = (content) => {
    // Simple markdown rendering for code blocks and basic formatting
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const listRegex = /^- (.+)$/gm;

    let processedContent = content
      .replace(codeBlockRegex, '<pre class="bg-muted p-3 rounded-md my-2 overflow-x-auto"><code>$2</code></pre>')
      .replace(inlineCodeRegex, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(boldRegex, '<strong>$1</strong>')
      .replace(listRegex, '• $1')
      .replace(/\n/g, '<br>');

    return { __html: processedContent };
  };

  if (isLoading) {
    return (
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
          <Icon name="Bot" size={16} className="text-muted-foreground" />
        </div>
        <div className="flex-1 max-w-3xl">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-muted-foreground">AI is analyzing...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
        {isUser ? (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={16} color="white" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <Icon name="Bot" size={16} className="text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`rounded-lg p-4 shadow-sm ${
          isUser 
            ? 'bg-primary text-primary-foreground ml-12' 
            : 'bg-card border border-border mr-12'
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div 
              className="text-sm leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={renderMarkdownContent(message.content)}
            />
          )}
          
          <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
            isUser ? 'border-primary-foreground/20' : 'border-border'
          }`}>
            <span className={`text-xs ${
              isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
            }`}>
              {formatTimestamp(timestamp)}
            </span>
            
            {!isUser && (
              <div className="flex items-center space-x-2">
                <button className="text-xs text-muted-foreground hover:text-foreground transition-micro flex items-center space-x-1">
                  <Icon name="Copy" size={12} />
                  <span>Copy</span>
                </button>
                <button className="text-xs text-muted-foreground hover:text-foreground transition-micro flex items-center space-x-1">
                  <Icon name="ThumbsUp" size={12} />
                </button>
                <button className="text-xs text-muted-foreground hover:text-foreground transition-micro flex items-center space-x-1">
                  <Icon name="ThumbsDown" size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;