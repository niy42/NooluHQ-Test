import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
