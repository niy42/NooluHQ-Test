import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import { useAppSelector } from "@/redux/store/hooks";
import { selectIsAuthenticated } from "@/redux/store/slices/authSlice";

export default function DashboardLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }
  return (
    <div className="hide-scrollbar flex h-screen overflow-y-auto bg-gray-50">
      <div className="relative h-auto">
        <Sidebar />
      </div>
      <div className="flex h-full flex-1 flex-col">
        <Navbar />
        <main className="hide-scrollbar flex-1 overflow-y-auto px-8 py-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
