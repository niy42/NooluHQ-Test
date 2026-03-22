import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import WhatDoYouWantToAchieve from "../pages/auth/WhatDoYouWantToAchieve/WhatDoYouWantToAchieve";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import Dashboard from "@/pages/dashboard/dashboard";
import WhoIsJoining from "@/pages/auth/WhyJoinUs/WhyJoinUs";
import SignupForm from "@/pages/auth/Signup/Signup";
import VerifyEmail from "@/pages/auth/VerifyEmail/VerifyEmail";
import CreateWorkspace from "@/pages/auth/CreateWorkspace/CreateWorkspace";
import InviteTeammates from "@/pages/auth/InviteTeam/InviteTeam";
import Analytics from "@/pages/analytics/analytics";
import Settings from "@/pages/settings/settings";
import Integrations from "@/pages/integrations/integrations";
import Reports from "@/pages/reports/reports";
import Users from "@/pages/users/users";
import LoginForm from "@/pages/auth/Login/Login";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route element={<AuthLayout />}>
          <Route
            path="/join-us"
            element={
              <ProtectedRoute>
                <WhoIsJoining />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/verify-email"
            element={
              <ProtectedRoute>
                <VerifyEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-workspace"
            element={
              <ProtectedRoute>
                <CreateWorkspace />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/invite-team"
            element={
              <ProtectedRoute>
                <InviteTeammates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achieve"
            element={
              <ProtectedRoute>
                <WhatDoYouWantToAchieve />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAuth>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requireAuth>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requireAuth>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="integrations"
            element={
              <ProtectedRoute requireAuth>
                <Integrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute requireAuth>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute requireAuth>
                <Users />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
