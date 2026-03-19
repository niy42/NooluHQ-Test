import Router from "./router/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import { AppSnackbarProvider } from "./components/AppSnackbarProvider/AppSnackbarProvider";
import { AuthBootstrapper } from "./components/AuthBootstrapper/AuthBootstrapper";

const queryClient = new QueryClient();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthBootstrapper>
          <QueryClientProvider client={queryClient}>
            <AppSnackbarProvider>
              <Router />
            </AppSnackbarProvider>
          </QueryClientProvider>
        </AuthBootstrapper>
      </PersistGate>
    </Provider>
  );
}
