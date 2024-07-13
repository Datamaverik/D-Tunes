import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  loggedInUser: string | null;
}

const PrivateRoute = ({ loggedInUser }: PrivateRouteProps) => {
  return loggedInUser ? <Outlet /> : <Navigate to="/api/login" />;
};

export default PrivateRoute;
