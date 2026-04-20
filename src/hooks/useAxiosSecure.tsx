import React from "react";

import axios from "axios";
import useAuth from "./useAuth";

type Auth = {
  token?: string;
};

const useAxiosSecure = () => {
  const { token } = useAuth() as Auth;
  // console.log(token);
  const axiosSecure = axios.create({
    baseURL: "http://localhost:5500/api/v1",
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return axiosSecure;
};

export default useAxiosSecure;
