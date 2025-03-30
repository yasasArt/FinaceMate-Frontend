import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";

const AuthProvider = () => {
  const [cookies] = useCookies(["authToken"]);

  return cookies.authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthProvider;
