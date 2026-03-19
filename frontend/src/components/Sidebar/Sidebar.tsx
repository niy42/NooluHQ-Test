import { useLocation, useNavigate } from "react-router-dom";
import DiagLogo from "../../assets/svg/diag.svg?react";
import classNames from "classnames";
import { sidebarItems } from "../constants";
import Medals from "@/assets/svg/Medal.svg?react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="flex w-56 flex-col bg-white py-4 pl-8">
      <div className="mb-28 flex items-center gap-2 p-4 text-xl font-semibold">
        <DiagLogo />
        DIAG
      </div>

      <ul className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li
              key={item.id}
              onClick={() => navigate(item.path)}
              className={classNames(
                "flex cursor-pointer items-center gap-3 rounded-xs p-3 transition",
                {
                  "border-r-4 border-r-blue-600 bg-blue-50 text-blue-600!":
                    isActive,
                  "text-gray-500 hover:bg-gray-100": !isActive,
                },
              )}
            >
              <span
                className={classNames({
                  "scale-110": isActive,
                })}
              >
                {item.icon}
              </span>

              <span className="text-sm font-medium">{item.label}</span>
            </li>
          );
        })}
      </ul>

      <div className="relative right-3 mt-auto flex flex-col space-y-2 rounded-xl border border-gray-200/50 bg-gray-100 p-4">
        <Medals />
        <p className="text-sm font-semibold">You're on a 7-day free trial</p>
        <p className="mt-1 text-xs text-gray-500">
          Enjoy full access to all features.
        </p>
        <button className="mt-3 w-full cursor-pointer rounded-lg bg-blue-600 py-2 text-sm text-white">
          Choose a Plan
        </button>
      </div>
    </aside>
  );
}
