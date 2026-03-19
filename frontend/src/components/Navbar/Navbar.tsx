import { persistor } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { logoutUser, selectCurrentUser } from "@/redux/store/slices/authSlice";
import { Search } from "lucide-react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  function handleLogout() {
    dispatch(logoutUser());
    persistor.purge();
    navigate("/signup");
  }

  return (
    <header className="flex items-center justify-between bg-white p-8">
      <div className="relative w-1/3">
        <Search className="absolute top-1/2 -left-1 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Search anything..."
          className="w-full rounded-lg py-2 pr-4 pl-10 outline-none"
        />
      </div>

      <div className="flex items-center">
        <div className="justify-cehter flex h-10 w-10 items-center rounded-full bg-gray-100 p-4" />

        <Bell className="relative -left-8 cursor-pointer text-gray-500" />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center rounded-full">
              <img
                src="/images/Profile.png"
                alt="profile-user"
                className="h-8 w-8 rounded-full"
              />
            </div>
            <span className="text-sm font-medium">
              {user ? user.name : "User"}
            </span>
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
