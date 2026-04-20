/**
 * File: src/App.tsx
 * Main App component using RouterProvider
 */

import { RouterProvider } from "react-router";

import "./App.css";
import { route } from "./router/router";

function App() {
  return <RouterProvider router={route} />;
}

export default App;
