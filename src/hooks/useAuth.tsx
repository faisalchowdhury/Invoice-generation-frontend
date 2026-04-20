import { useContext } from "react";
import AuthContext from "../context/AuthContext.tsx";

const useAuth = () => {
  const context = useContext(AuthContext);

  return context || {};
};

export default useAuth;
