import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { logoutUser } from "@/redux/store/slices/authSlice";
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token: string) {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken?.token);
  const onboardingToken = useAppSelector(
    (state) => state.auth.onboardingToken?.token,
  );
  const rehydrated = useAppSelector((state) => state.auth._persist?.rehydrated);

  useEffect(() => {
    if (!rehydrated) return;

    if (accessToken) {
      if (isTokenExpired(accessToken)) {
        dispatch(logoutUser());
      }
      return;
    }
    if (onboardingToken) return;

    window.location.href = "/signup";
  }, [accessToken, onboardingToken, rehydrated, dispatch]);
}
