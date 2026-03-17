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
          <Route path="/invite-team" element={<InviteTeammates />} />
          <Route path="/achieve" element={<WhatDoYouWantToAchieve />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
