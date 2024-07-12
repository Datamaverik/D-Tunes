import { icons } from "../models/icons";
import styles from "../components/styles/Genre.module.css";

interface genreCardProps {
  icon: icons;
  name: string;
  onClick: () => void;
}

const GenreCard = ({ icon, name, onClick }: genreCardProps) => {
  return (
    <div>
      <div
        onClick={onClick}
        className={styles.imageCont}
        style={{ backgroundImage: `url(${icon.url})` }}
      ></div>
      <p className={styles.genreName}>{name}</p>
    </div>
  );
};

export default GenreCard;
