import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard': 'Dashboard',
    '/upload-scan': 'Upload Scan',
    '/vulnerabilities': 'Vulnerabilities',
    '/ai-chat-analysis': 'AI Analysis',
    '/reports': 'Reports',
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];

    // Always start with Dashboard as home
    if (location.pathname !== '/dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        path: '/dashboard',
        isActive: false
      });
    }

    // Add current page
    const currentRoute = `/${pathSegments.join('/')}`;
    if (routeMap[currentRoute]) {
      breadcrumbs.push({
        label: routeMap[currentRoute],
        path: currentRoute,
        isActive: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on login page or if only one item
  if (location.pathname === '/login' || breadcrumbs.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Icon name="Home" size={16} className="text-muted-foreground" />
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          )}
          {breadcrumb.isActive ? (
            <span className="text-foreground font-medium">
              {breadcrumb.label}
            </span>
          ) : (
            <button
              onClick={() => handleBreadcrumbClick(breadcrumb.path)}
              className="hover:text-foreground transition-micro"
            >
              {breadcrumb.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;