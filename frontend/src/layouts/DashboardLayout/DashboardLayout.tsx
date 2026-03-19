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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="overflow-y-auto px-8 py-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
