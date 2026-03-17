import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search anything..."
        className="w-1/3 rounded-lg bg-gray-100 px-4 py-2 outline-none"
      />

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Bell className="text-gray-500" />

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-500" />
          <span className="text-sm font-medium">Adebanjo Promise</span>
        </div>
      </div>
    </header>
  );
}
