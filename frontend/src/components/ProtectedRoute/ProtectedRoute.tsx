import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/store/hooks";

export function ProtectedRoute({
  children,
  requireAuth,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) {
  const accessToken = useAppSelector((state) => state.auth.accessToken?.token);
  const onboardingToken = useAppSelector(
    (state) => state.auth.onboardingToken?.token,
  );

  if (!!requireAuth && accessToken) return <>{children}</>;
  if (!requireAuth && (accessToken || onboardingToken)) return <>{children}</>;

  return <Navigate to="/signup" replace />;
}
