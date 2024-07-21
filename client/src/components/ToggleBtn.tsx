import styles from "../components/styles/form.module.css";

interface toggleBtnProps {
  onClick: () => void;
  isToggleOn: boolean;
  img1:string;
  img2:string;
}
const ToggleBtn = ({ onClick,isToggleOn,img1,img2 }: toggleBtnProps) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.toggle} ${
        isToggleOn ? styles.toggleChecked : ""
      }`}
    >
      <div className={styles.toggleCont}>
        <div className={styles.toggleCheck}>
          <span>
            <img
              style={{ height: "25px", width: "25px" }}
              src={img1}
              alt=""
            />
          </span>
        </div>
        <div className={styles.toggleUncheck}>
          <span>
            <img
              style={{ height: "30px", width: "35px" }}
              src={img2}
              alt=""
            />
          </span>
        </div>
      </div>
      <div className={styles.toggleCircle}></div>
      <input
        className={styles.toggleInput}
        defaultChecked={isToggleOn}
        type="checkbox"
        aria-label="Toggle Button"
      />
    </div>
  );
};

export default ToggleBtn;
