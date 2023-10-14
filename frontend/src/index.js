import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import Login from "./routes/Login";
import Home from "./routes/Home"; 
import Assignments from "./routes/Assignments";
import Overview from "./routes/Overview";
import Students from "./routes/Students";
import Navbar from "./components/Navbar"
import ErrorPage from "./routes/ErrorPage";
import "./App.css";

const AppLayout = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Login /> ,
      },
      {
        path: "home",
        element: <Home /> ,
      },
      {
        path: "assignments",
        element: <Assignments />,
      },
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "students",
        element: <Students />,
      },
    ]
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);