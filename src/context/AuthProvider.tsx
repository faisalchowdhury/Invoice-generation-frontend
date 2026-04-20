// import React, { useEffect, useState } from "react";

// import AuthContext from "./AuthContext";
// import useAxiosBase from "../hooks/useAxios";

// export default function AuthProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [loading, setLoading] = useState(true);

//   const axiosSecure = useAxiosBase();

//   // login
//   const login = async (email: any, password: any) => {
//     try {
//       setLoading(true);

//       const res = await axiosSecure.post("/auth/login", { email, password });

//       const { token } = res.data.data;

//       localStorage.setItem("token", token);

//       setToken(token);

//       const response = await axiosSecure.get("/auth/my-profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log(response?.data?.data, "testttttttttttttttttttt");
//       setUser(response?.data?.data);
//       setLoading(false);
//       return res.data;
//     } catch (error: any) {
//       setLoading(false);
//       throw error.response?.data?.message || "Login failed. Please try again.";
//     }
//   };

//   useEffect(() => {
//     console.log(".................................", loading, user);
//     setLoading(true);
//     const savedToken = localStorage.getItem("token");

//     if (savedToken) {
//       setToken(savedToken);
//       axiosSecure
//         .get("/auth/my-profile", {
//           headers: { Authorization: `Bearer ${savedToken}` },
//         })
//         .then((res) => {
//           setLoading(true);

//           setUser(res.data.data);
//         })
//         .catch(() => logout())
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   // a logout
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//   };

//   // Restore user on reload

//   const userInfo = {
//     user,
//     setUser,
//     token,
//     login,
//     logout,
//     setLoading,
//     loading,
//     setToken,
//   };

//   return (
//     <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
//   );
// }
