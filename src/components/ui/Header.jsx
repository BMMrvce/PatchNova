import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { path: '/upload-scan', label: 'Upload Scan', icon: 'Upload' },
    { path: '/vulnerabilities', label: 'Vulnerabilities', icon: 'Shield' },
    { path: '/ai-chat-analysis', label: 'AI Analysis', icon: 'MessageSquare' },
    { path: '/reports', label: 'Reports', icon: 'FileText' },
    { path: '/logs', label: 'Logs', icon: 'Activity' }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Shield" size={20} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">PatchNova</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                <Icon name="User" size={16} className="text-primary" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-foreground">
                  {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {userProfile?.role || 'Member'}
                </div>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-border">
                  <div className="text-sm font-medium text-foreground">
                    {userProfile?.full_name || 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/profile');
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Icon name="Settings" size={16} />
                  <span>Profile Settings</span>
                </button>
                
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Icon name="LogOut" size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;