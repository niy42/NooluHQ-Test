import { LayoutDashboard } from "lucide-react";
import Chartbar from "@/assets/svg/ChartBar.svg?react";
import Chartline from "@/assets/svg/ChartLine.svg?react";
import GearSix from "@/assets/svg/GearSix.svg?react";
import Users from "@/assets/svg/Users.svg?react";
import Plugs from "@/assets/svg/PlugsConnected.svg?react";

export const steps = [
  "Create Your Account",
  "Tell Us About You",
  "Set Up Your Workspace",
  "Choose Your Focus",
];

export const sidebarItems = [
  { id: 1, label: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
  { id: 2, label: "Report", icon: <Chartbar />, path: "/reports" },
  { id: 3, label: "Analytics", icon: <Chartline />, path: "/analytics" },
  { id: 4, label: "Users", icon: <Users />, path: "/users" },
  { id: 5, label: "Integrations", icon: <Plugs />, path: "/integrations" },
  { id: 6, label: "Settings", icon: <GearSix />, path: "/settings" },
];

const STATUS_STYLES: Record<string, { dot: string; chip: string }> = {
  Active: {
    dot: "bg-green-500",
    chip: "bg-green-100 text-green-700",
  },
  Trial: {
    dot: "bg-yellow-500",
    chip: "bg-yellow-100 text-yellow-700",
  },
  Inactive: {
    dot: "bg-red-500",
    chip: "bg-red-100 text-red-700",
  },
};

const DEFAULT_STYLE = {
  dot: "bg-gray-400",
  chip: "bg-gray-100 text-gray-700",
};

const getStatusConfig = (status: string) =>
  STATUS_STYLES[status] ?? DEFAULT_STYLE;

export const StatusCell = ({ status }: { status: string }) => {
  const { dot, chip } = getStatusConfig(status);

  return (
    <div
      className={`flex w-fit items-center gap-2 rounded-full px-2 py-1 ${chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="text-xs font-light">{status}</span>
    </div>
  );
};
