// filepath: src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import React from "react";
const ProtectedRoute = ({ children }) => {
  const steamId = localStorage.getItem("steam_id");
  const token = localStorage.getItem("token");
  if (!steamId || !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default ProtectedRoute;