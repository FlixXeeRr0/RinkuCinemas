import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';

import AppBarComponent from '../components/AppBar/AppBar';
import StartPage from '../pages/start/startPage.jsx';
import EmployeePage from '../pages/employees/employeePage.jsx';
import NotFoundPage from '../pages/notFound/notFoundPage.jsx';
import TransactionsPage from '../pages/movement/movementPage.jsx';
import ReportsPage from '../pages/reports/reportsPage.jsx';

import theme from '../themes/defaultTheme.js';

const Layout = React.memo(function Layout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBarComponent />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
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
          <Route path="reportes" element={<ReportsPage />} />
        </Route>

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default React.memo(AppRouter);
