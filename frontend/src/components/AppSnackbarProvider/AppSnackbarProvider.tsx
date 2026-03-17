"use client";

import { SnackbarProvider } from "notistack";

export function AppSnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {children}
    </SnackbarProvider>
  );
}
