import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "./theme";
import { Toaster } from "react-hot-toast"; // Import the custom dark theme
import { Login } from "./pages/Login";
import { Chat } from "./pages/Chat";
import { Register } from "./pages/Register";
import { AuthRoute } from "./AuthRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <AuthRoute>
        <Chat />
      </AuthRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Toaster position="bottom-center" />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
