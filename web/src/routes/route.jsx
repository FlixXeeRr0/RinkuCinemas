import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Box from "@mui/material/Box";

import AppBarComponent from "../components/AppBar/AppBar";

const Layout = React.memo(function Layout() {
  return (
    <>
      <AppBarComponent />
      <Outlet />
    </>
  );
});

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="inicio" />} />

          <Route path="inicio" element={<Box sx={{ p: 2 }}>Página de inicio</Box>} />
        </Route>

        <Route path="/*" element={<Box sx={{ p: 2 }}>Page no found</Box>} />
      </Routes>
    </BrowserRouter>
  );
};

export default React.memo(AppRouter);
