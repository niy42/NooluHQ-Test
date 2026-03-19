import { useAuthBootstrap } from "@/utils/hooks/useAuthBootstrap/useAuthBootstrap";

export function AuthBootstrapper({ children }: { children: React.ReactNode }) {
  useAuthBootstrap();
  return <>{children}</>;
}
