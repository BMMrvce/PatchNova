import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Login from "pages/login";
import UploadScan from "pages/upload-scan";
import Dashboard from "pages/dashboard";
import AiChatAnalysis from "pages/ai-chat-analysis";
import Reports from "pages/reports";
import Vulnerabilities from "pages/vulnerabilities";
import LogsPage from "pages/logs";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload-scan" element={<UploadScan />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-chat-analysis" element={<AiChatAnalysis />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/vulnerabilities" element={<Vulnerabilities />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;