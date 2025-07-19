import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';
import SecurityPattern from './components/SecurityPattern';

const Login = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Check if user is already authenticated
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      {/* Security Pattern Background */}
      <SecurityPattern />
      
      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="bg-card border border-border rounded-xl shadow-elevation-3 p-8">
          {/* Header */}
          <LoginHeader />
          
          {/* Login Form */}
          <LoginForm />
          
          {/* Footer */}
          <LoginFooter />
        </div>
      </div>

      {/* Additional Security Indicators */}
      <div className="fixed bottom-4 left-4 right-4 z-20">
        <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>Secure Connection</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>System Online</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>Data Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;