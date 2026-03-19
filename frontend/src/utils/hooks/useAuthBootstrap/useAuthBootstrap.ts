import { jwtDecode } from "jwt-decode";
import { logoutUser } from "@/redux/store/slices/authSlice";
import { selectAccessToken } from "@/redux/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { useEffect } from "react";

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
  const token = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      dispatch(logoutUser());
    }
  }, [token, dispatch]);
}
