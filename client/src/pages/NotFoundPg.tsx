import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPg = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>NotFoundPg</div>;
};

export default NotFoundPg;
