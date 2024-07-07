import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function AuthRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("accessToken")
  );
  return authenticated ? children : <Navigate to="/login"></Navigate>;
}

export default AuthRoute;
