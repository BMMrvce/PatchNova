import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date().getFullYear();

  const securityFeatures = [
   
  ];

  return (
    <div className="mt-8 space-y-6">
      {/* Security Trust Signals */}
      <div className="grid grid-cols-2 gap-4">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name={feature.icon} size={14} className="text-success" />
            <span>{feature.text}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Footer Links */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <button className="hover:text-foreground transition-micro">
            {/* Privacy Policy */}
          </button>
          <button className="hover:text-foreground transition-micro">
            {/* Terms of Service */}
          </button>
          <button className="hover:text-foreground transition-micro">
            {/* Support */}
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Copyright" size={12} />
          {/* <span>{currentYear} PatchMate AI. All rights reserved.</span> */}
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center">
        <span className="text-xs text-muted-foreground/60">
          {/* Version 2.1.0 | Build 2025.07.11 */}
        </span>
      </div>
    </div>
  );
};

export default LoginFooter;