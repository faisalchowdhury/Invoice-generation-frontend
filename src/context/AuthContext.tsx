import React, { createContext } from "react";

type AuthContextType = {
  user: any;
  setUser: (user: any) => void;
} | null;

const AuthContext = createContext<AuthContextType>(null);

export default AuthContext;
