import { useAppDispatch } from "@/redux/store/hooks";
import { logoutUser } from "@/redux/store/slices/authSlice";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/signup");
    window.location.reload();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <input
        type="text"
        placeholder="Search anything..."
        className="w-1/3 rounded-lg bg-gray-100 px-4 py-2 outline-none"
      />

      <div className="flex items-center gap-4">
        <Bell className="text-gray-500" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-500" />
            <span className="text-sm font-medium">Adebanjo Promise</span>
          </div>

          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
