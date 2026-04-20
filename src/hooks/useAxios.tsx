import axios from "axios";
import React from "react";
const axiosBase = axios.create({
  baseURL: "http://localhost:5500/api/v1",
});
const useAxiosBase = () => {
  return axiosBase;
};

export default useAxiosBase;
