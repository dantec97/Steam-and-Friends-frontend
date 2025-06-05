import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const steamId = localStorage.getItem("steam_id");
  if (!steamId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;