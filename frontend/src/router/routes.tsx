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

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route element={<AuthLayout />}>
          <Route path="/join-us" element={<WhoIsJoining />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/create-workspace" element={<CreateWorkspace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/invite-team" element={<InviteTeammates />} />
          <Route path="/achieve" element={<WhatDoYouWantToAchieve />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
