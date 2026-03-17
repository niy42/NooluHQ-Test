import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  Wrench,
} from "lucide-react";

const sidebarItems = [
  { id: 1, label: "Dashboard", icon: <LayoutDashboard />, path: "/" },
  { id: 2, label: "Report", icon: <BarChart3 />, path: "/report" },
  { id: 3, label: "Analytics", icon: <BarChart3 />, path: "/analytics" },
  { id: 4, label: "Users", icon: <Users />, path: "/users" },
  { id: 5, label: "Integrations", icon: <Wrench />, path: "/integrations" },
  { id: 6, label: "Settings", icon: <Settings />, path: "/settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="flex w-64 flex-col border-r bg-white p-4">
      {/* LOGO */}
      <div className="mb-8 flex items-center gap-2 text-xl font-semibold">
        <div className="h-6 w-6 rounded-full bg-blue-500" />
        DIAG
      </div>

      {/* MENU */}
      <ul className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span className={`${isActive ? "scale-110" : ""}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </li>
          );
        })}
      </ul>

      {/* TRIAL CARD */}
      <div className="mt-auto rounded-xl bg-gray-100 p-4">
        <p className="text-sm font-semibold">You're on a 7-day free trial</p>
        <p className="mt-1 text-xs text-gray-500">
          Enjoy full access to all features.
        </p>
        <button className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm text-white">
          Choose a Plan
        </button>
      </div>
    </aside>
  );
}
