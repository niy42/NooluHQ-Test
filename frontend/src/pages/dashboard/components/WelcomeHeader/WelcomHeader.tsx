import { useAppSelector } from "@/redux/store/hooks";
import { selectCurrentUser } from "@/redux/store/slices/authSlice";

export default function WelcomeHeader() {
  let user = useAppSelector(selectCurrentUser);
  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Welcome {user ? user.name : "User"}
      </h1>
    </div>
  );
}
