// hooks/useLoading.ts
import { LoadingContextType, useLoadingContext } from "../Contexts/Loading.context";

const useLoading = ():LoadingContextType => {
  const context = useLoadingContext();
  return context;
};

export default useLoading;
