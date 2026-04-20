import { Navigate, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/utils/Loading";

export const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, token, logout, loading } = useAuth() as any;

  const navigate = useNavigate();

  if (loading) return <Loading></Loading>;

  if (!token) return <Navigate to="/login" replace />;

  if (!user) return <Loading />;

  return children;
};
