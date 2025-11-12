import React, { Fragment } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';

import AppBarComponent from '../components/AppBar/AppBar';
import StartPage from '../pages/start';
import EmployeePage from '../pages/employees';
import NotFoundPage from '../pages/notFound';
import TransactionsPage from '../pages/transactions';

const Layout = React.memo(function Layout() {
  return (
    <div style={{ height: '100svh', backgroundColor: '#f5f5f5' }}>
      <AppBarComponent />
      <Outlet />
    </div>
  );
});

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="inicio" />} />

          <Route path="inicio" element={<StartPage />} />
          <Route path="empleados" element={<EmployeePage />} />
          <Route path="captura" element={<TransactionsPage />} />
        </Route>

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default React.memo(AppRouter);
