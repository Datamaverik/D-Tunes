// context/LoadingContext.tsx
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export interface LoadingContextType {
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoadingContext must be used within a LoadingProvider");
  }
  return context;
};
