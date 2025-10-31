import { Suspense, type ReactNode } from "react";
import { Provider } from "react-redux";
import store from "../redux/store/store";
import BlankPageLoader from "../../Components/BlankPageLoader/BlankPageLoader";

type AppProviderProps = { children: ReactNode };

export function AppProvider({ children }: AppProviderProps) {
  return (
    <Suspense fallback={<BlankPageLoader />}>
      <Provider store={store}>{children}</Provider>
    </Suspense>
  );
}

export default AppProvider;
