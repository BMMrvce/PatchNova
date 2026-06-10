import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about vulnerabilities, patches, or security recommendations..."
              disabled={disabled || isLoading}
              className="w-full min-h-[44px] max-h-[120px] px-4 py-3 pr-12 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
            />
            
            {/* Character count */}
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {message.length}/1000
            </div>
          </div>
          
          {/* Input hints */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="CornerDownLeft" size={12} />
                <span>Send</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="CornerDownLeft" size={12} />
                <span>+ Shift for new line</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-micro flex items-center space-x-1"
                disabled={disabled || isLoading}
              >
                <Icon name="Paperclip" size={12} />
                <span>Attach scan</span>
              </button>
            </div>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="default"
          size="default"
          disabled={!message.trim() || isLoading || disabled}
          loading={isLoading}
          iconName="Send"
          iconPosition="left"
          iconSize={16}
          className="px-6"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;