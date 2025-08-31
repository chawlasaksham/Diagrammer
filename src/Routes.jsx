import React from "react";
import { Routes as RouterRoutes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import ContextToolbar from "components/ui/ContextToolbar";

// Page imports
import WorkflowDashboard from "pages/workflow-dashboard";
import VisualWorkflowEditor from "pages/visual-workflow-editor";
import NodeConfigurationPanel from "pages/node-configuration-panel";
import WorkflowExecutionMonitor from "pages/workflow-execution-monitor";
import WorkflowTemplatesLibrary from "pages/workflow-templates-library";
import ProfilePage from 'pages/profile';
import SettingsPage from 'pages/settings/SettingsPage';
import UsageAndPlan from 'pages/settings/UsageAndPlan';
import PersonalSettings from 'pages/settings/PersonalSettings';
import Users from 'pages/settings/Users';
import APIKeys from 'pages/settings/APIKeys';
import SignInSignUp from 'pages/SignInSignUp';
import { useEffect } from 'react';
import ResetPassword from 'pages/ResetPassword';
import EditProfile from 'pages/profile/EditProfile';

function RequireAuth({ children }) {
  const location = useLocation();
  const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('auth') === '1';
  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children ? children : <Outlet />;
}

function RedirectIfAuth() {
  const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('auth') === '1';
  if (isAuth) {
    return <Navigate to="/diagram-dashboard" replace />;
  }
  return <SignInSignUp />;
}

const SettingsUsage = () => <div><h2 className="text-xl font-bold mb-4">Usage and Plan</h2><p>Usage and plan details go here.</p></div>;
const SettingsPersonal = () => <div><h2 className="text-xl font-bold mb-4">Personal Settings</h2><p>Personal settings form goes here.</p></div>;
const SettingsUsers = () => <div><h2 className="text-xl font-bold mb-4">Users</h2><p>User management table goes here.</p></div>;
const SettingsAPI = () => <div><h2 className="text-xl font-bold mb-4">API Keys</h2><p>API key management goes here.</p></div>;
const SettingsExternalSecrets = () => <div><h2 className="text-xl font-bold mb-4">External Secrets</h2><p>External secrets config goes here.</p></div>;
const SettingsEnvironments = () => <div><h2 className="text-xl font-bold mb-4">Environments</h2><p>Environment management goes here.</p></div>;
const SettingsSSO = () => <div><h2 className="text-xl font-bold mb-4">SSO</h2><p>SSO config goes here.</p></div>;
const SettingsLDAP = () => <div><h2 className="text-xl font-bold mb-4">LDAP</h2><p>LDAP config goes here.</p></div>;
const SettingsLogStreaming = () => <div><h2 className="text-xl font-bold mb-4">Log Streaming</h2><p>Log streaming config goes here.</p></div>;
const SettingsCommunityNodes = () => <div><h2 className="text-xl font-bold mb-4">Community Nodes</h2><p>Community nodes info goes here.</p></div>;

const AppLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const Routes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="min-h-screen bg-background">
        <div>
          <RouterRoutes>
            <Route path="/" element={<RedirectIfAuth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/diagram-dashboard" element={<WorkflowDashboard />} />
                <Route path="/visual-workflow-editor" element={<VisualWorkflowEditor />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/settings" element={<SettingsPage />}>
                  <Route path="usage" element={<UsageAndPlan />} />
                  <Route path="personal" element={<PersonalSettings />} />
                  <Route path="users" element={<Users />} />
                  <Route path="api" element={<APIKeys />} />
                  <Route index element={<UsageAndPlan />} />
                </Route>
              </Route>
            </Route>
          </RouterRoutes>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Routes;