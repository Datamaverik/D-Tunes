import { useNavigate } from "react-router-dom";

const NotFoundPg = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
    window.location.reload();
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src="../../public/404Page.jpg"
        alt="404 not found"
        style={{
          width: "45%",
          height: "auto",
        }}
      ></img>
      <button onClick={handleClick}>Home</button>
    </div>
  );
};

export default NotFoundPg;
