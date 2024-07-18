import { useEffect, useRef } from "react";
import Toast from "./Toast";
import styles from "../components/styles/Toast.module.css";

export interface ToastType {
  message: string;
  type: "success" | "failure" | "warning";
  id: string;
}
interface ToastListProps {
  removeToast: (id: string) => void;
  data: ToastType[];
}

const ToastList = ({ data, removeToast }: ToastListProps) => {
  const listRef = useRef(null);

  const handleScrolling = (el: HTMLDivElement | null) => {
    if (!el) return;
    el?.scrollTo(0, el.scrollHeight);
  };

  useEffect(() => {
    handleScrolling(listRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    data.length > 0 && (
      <div
        className={`${styles.toastList}`}
        aria-live="assertive"
        ref={listRef}
      >
        {data.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    )
  );
};

export default ToastList;
