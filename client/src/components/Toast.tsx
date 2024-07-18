import styles from "../components/styles/Toast.module.css";

import { SuccessIcon, FailureIcon, WarningIcon, CloseIcon } from "./Icons";

export interface ToastProps {
  message: string;
  type: "success" | "failure" | "warning";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  const iconMap = {
    success: <SuccessIcon />,
    failure: <FailureIcon />,
    warning: <WarningIcon />,
  };

  const toastIcon = iconMap[type] || null;

  return (
    <div className={`${styles.toast} ${styles[`toast--${type}`]}`} role="alert">
      <div className={styles.toastMessage}>
        {toastIcon && (
          <div
            className={`${styles.icon} ${styles.icon}--lg ${styles.icon}--thumb`}
          >
            {toastIcon}
          </div>
        )}
        <p>{message}</p>
      </div>
      <button className={styles.toastCloseBtn} onClick={onClose}>
        <span className={styles.icon}>
          <CloseIcon />
        </span>
      </button>
    </div>
  );
};

export default Toast;
