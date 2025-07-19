import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityPattern = () => {
  const patternIcons = [
    'Shield', 'Lock', 'Key', 'ShieldCheck', 'AlertTriangle', 
    'Eye', 'Fingerprint', 'Zap', 'Activity', 'Database'
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-8 h-full">
          {Array.from({ length: 120 }).map((_, index) => {
            const iconName = patternIcons[index % patternIcons.length];
            const delay = Math.random() * 5;
            const duration = 8 + Math.random() * 4;
            
            return (
              <div
                key={index}
                className="flex items-center justify-center animate-pulse"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`
                }}
              >
                <Icon 
                  name={iconName} 
                  size={16} 
                  className="text-primary/30" 
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Security Elements */}
      <div className="absolute top-20 left-20 animate-bounce" style={{ animationDuration: '3s' }}>
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="Shield" size={24} className="text-primary/40" />
        </div>
      </div>

      <div className="absolute top-40 right-32 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
          <Icon name="Lock" size={20} className="text-secondary/40" />
        </div>
      </div>

      <div className="absolute bottom-32 left-40 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>
        <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center">
          <Icon name="Key" size={22} className="text-accent/40" />
        </div>
      </div>

      <div className="absolute bottom-20 right-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
          <Icon name="ShieldCheck" size={18} className="text-success/40" />
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 via-transparent to-success/5" />
    </div>
  );
};

export default SecurityPattern;