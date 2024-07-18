import { createContext, useState, ReactNode } from "react";

export interface ToastType {
  message: string;
  type: "success" | "failure" | "warning";
  id: string;
}

export interface ToastContextType {
  showToast: (message: string, type: "success" | "failure" | "warning") => void;
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const showToast = (
    message: string,
    type: "success" | "failure" | "warning"
  ) => {
    const toast = {
      id: Date.now().toString(),
      message,
      type,
    };

    setToasts((prevToasts) => [...prevToasts, toast]);

    setTimeout(() => {
      removeToast(toast.id);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
