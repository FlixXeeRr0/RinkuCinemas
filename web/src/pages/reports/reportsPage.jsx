import { useCallback, useState } from 'react';

import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { MdNavigateNext, MdNavigateBefore, MdCleaningServices } from 'react-icons/md';
import { toast } from 'react-toastify';

import { employeeService } from '../../services/employeeService';
import { reportService } from '../../services/reportService';

import CustomTextField from '../../components/CustomTextField';
import CustomSelect from '../../components/CustomSelect';
import CustomTable from '../../components/CustomTable';
import {
  BorderBottomContainer,
  FormContainer,
  MainBox,
  ContainerBox,
} from '../../components/StyledComponents';
import { FOUND_VALUES, NO_FOUND_VALUES, IS_REQUIRED } from '../../config/messages';
import MonthsEnum from '../../enums/MonthsEnum';
import theme from '../../themes/defaultTheme';

const INITIAL_FORM_STATE = {
  EmployeeID: null,
  EmployeeCode: '',
  FullName: '',
  RoleName: '',
  EmployeeTypeName: '',
};

const ReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Search results for navigation
  const [employeesFound, setEmployeesFound] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Period selection
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  // Report data
  const [reportData, setReportData] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // Reset form
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setEmployeesFound([]);
    setCurrentIndex(0);
    setSearchValue('');
    setSelectedMonth('');
    setSelectedYear('');
    setAvailableYears([]);
    setReportData(null);
    setShowReport(false);
  };

  // Handle search
  const handleSearch = useCallback(async () => {
    const searchTxt = searchValue.trim();
    if (!searchTxt) {
      toast.error('Por favor ingrese un criterio de búsqueda');
      return;
    }

    setLoading(true);

    const employees = await employeeService.search(searchTxt);
    const totalEmployees = employees.length;

    if (totalEmployees === 0) {
      toast.error(NO_FOUND_VALUES);
      resetForm();
      setLoading(false);
      return;
    }

    setEmployeesFound(employees);
    setCurrentIndex(0);
    await loadEmployeeData(employees[0]);

    if (totalEmployees > 1) {
      toast.info(FOUND_VALUES(totalEmployees, 'empleados'));
    }

    setLoading(false);
  }, [searchValue]);

  // Load employee data
  const loadEmployeeData = async (employee) => {
    const data = {
      EmployeeID: employee.ID,
      EmployeeCode: employee.EmployeeCode,
      FullName: employee.FullName,
      RoleName: employee.Role?.Name || '',
      EmployeeTypeName: employee.EmployeeType?.Name || '',
    };

    setFormData(data);
    setSelectedMonth('');
    setSelectedYear('');
    setReportData(null);
    setShowReport(false);

    // Load available years
    const years = await reportService.getYears(employee.ID);
    if (years && years.length > 0) {
      setAvailableYears(
        years.map((year) => ({
          value: String(year),
          label: String(year),
        }))
      );
    } else {
      setAvailableYears([]);
      toast.info('Este empleado no tiene movimientos registrados');
    }
  };

  // Navigate between search results
  const handleNavigate = async (direction) => {
    const newIndex =
      direction === 'next'
        ? Math.min(currentIndex + 1, employeesFound.length - 1)
        : Math.max(currentIndex - 1, 0);

    setCurrentIndex(newIndex);
    await loadEmployeeData(employeesFound[newIndex]);
  };

  // Handle consult
  const handleConsult = async () => {
    if (!selectedMonth) {
      toast.error('Debe seleccionar un mes');
      return;
    }

    if (!selectedYear) {
      toast.error('Debe seleccionar un año');
      return;
    }

    setLoading(true);

    const report = await reportService.getPayroll(formData.EmployeeID, selectedMonth, selectedYear);

    if (!report) {
      toast.error('No se encontraron movimientos para el periodo seleccionado');
      setReportData(null);
      setShowReport(false);
      setLoading(false);
      return;
    }

    setReportData(report);
    setShowReport(true);
    setLoading(false);
  };

  // Handle Enter key on search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Table columns
  const columns = [
    { field: 'ID', label: 'ID', align: 'center' },
    { field: 'Date', label: 'Fecha', align: 'center' },
    { field: 'HoursWorked', label: 'Horas Trabajadas', align: 'center' },
    { field: 'DeliveriesCount', label: 'Entregas Realizadas', align: 'center' },
    { field: 'HourlyBonus', label: 'Bono por Hora', align: 'right' },
    { field: 'BaseSalary', label: 'Sueldo Base', align: 'right' },
    { field: 'RoleBonus', label: 'Bono por Rol', align: 'right' },
    { field: 'DeliveryBonus', label: 'Bono de Entregas', align: 'right' },
  ];

  // Format table rows
  const rows = reportData
    ? reportData.movements.map((movement) => ({
        id: movement.ID,
        ID: movement.ID,
        Date: new Date(movement.Date).toLocaleDateString('es-MX'),
        HoursWorked: movement.HoursWorked.toFixed(2),
        DeliveriesCount: movement.DeliveriesCount,
        HourlyBonus: `$${movement.HourlyBonus.toFixed(2)}`,
        BaseSalary: `$${movement.BaseSalary.toFixed(2)}`,
        RoleBonus: `$${movement.RoleBonus.toFixed(2)}`,
        DeliveryBonus: `$${movement.DeliveryBonus.toFixed(2)}`,
      }))
    : [];

  return (
    <MainBox>
      <ContainerBox>
        <BorderBottomContainer>
          <Typography variant="h4" sx={{ textAlign: 'start', fontWeight: 500 }}>
            Reporte de Nómina
          </Typography>
        </BorderBottomContainer>

        {/* Search bar */}
        <Box sx={{ display: 'flex', width: '100%', gap: 3 }}>
          <CustomTextField
            id="search"
            label="Buscar Empleado"
            placeholder="Búsqueda por código o nombre"
            icon={<FaSearch />}
            onIconClick={handleSearch}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            disabled={loading}
            fullWidth
          />
          <Button sx={{ maxHeight: '36px' }} variant="outlined" onClick={() => resetForm()}>
            <MdCleaningServices size={20} />
          </Button>
        </Box>

        {/* Form */}
        <FormContainer>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '400px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Employee Info Section */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: 'column',
                    padding: 2,
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start', fontWeight: 500 }}>
                        Código de empleado:
                      </Typography>
                      <CustomTextField
                        id="employeeCode"
                        placeholder="Código de empleado"
                        value={formData.EmployeeCode}
                        disabled
                        fullWidth
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start', fontWeight: 500 }}>
                        Nombre completo:
                      </Typography>
                      <CustomTextField
                        id="fullName"
                        placeholder="Nombre completo"
                        value={formData.FullName}
                        disabled
                        fullWidth
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start', fontWeight: 500 }}>Rol:</Typography>
                      <CustomTextField
                        id="roleName"
                        placeholder="Rol"
                        value={formData.RoleName}
                        disabled
                        fullWidth
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start', fontWeight: 500 }}>
                        Tipo de empleado:
                      </Typography>
                      <CustomTextField
                        id="employeeTypeName"
                        placeholder="Tipo de empleado"
                        value={formData.EmployeeTypeName}
                        disabled
                        fullWidth
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Period Selection */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    padding: 2,
                    alignItems: 'end',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ textAlign: 'start', fontWeight: 500, mb: 1 }}>
                      Mes:
                    </Typography>
                    <CustomSelect
                      id="month"
                      placeholder="Selecciona un mes"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      options={MonthsEnum}
                      disabled={!formData.EmployeeID}
                      fullWidth
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ textAlign: 'start', fontWeight: 500, mb: 1 }}>
                      Año:
                    </Typography>
                    <CustomSelect
                      id="year"
                      placeholder="Selecciona un año"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      options={availableYears}
                      disabled={!formData.EmployeeID || availableYears.length === 0}
                      fullWidth
                    />
                  </Box>

                  <Button
                    variant="contained"
                    sx={{
                      height: '40px',
                      minWidth: '150px',
                    }}
                    onClick={handleConsult}
                    disabled={!formData.EmployeeID || !selectedMonth || !selectedYear}
                  >
                    Consultar
                  </Button>
                </Box>

                {/* Navigation buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 2,
                    borderBottom: showReport ? '1px solid #e0e0e0' : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {employeesFound.length > 1 && (
                      <>
                        <Button
                          variant="contained"
                          sx={{ maxHeight: '36px', minWidth: '100px' }}
                          startIcon={<MdNavigateBefore />}
                          onClick={() => handleNavigate('prev')}
                          disabled={currentIndex === 0 || loading}
                        >
                          Anterior
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ maxHeight: '36px', minWidth: '100px' }}
                          endIcon={<MdNavigateNext />}
                          onClick={() => handleNavigate('next')}
                          disabled={currentIndex === employeesFound.length - 1 || loading}
                        >
                          Siguiente
                        </Button>
                        <Typography sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          {currentIndex + 1} de {employeesFound.length}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>

                {/* Report Section */}
                {showReport && reportData && (
                  <Box sx={{ padding: 2 }}>
                    {/* Table */}
                    <Box sx={{ mb: 3 }}>
                      <CustomTable columns={columns} rows={rows} />
                    </Box>

                    {/* Totals */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 4,
                        backgroundColor: theme.palette.background.default,
                        padding: 3,
                        borderRadius: '8px',
                      }}
                    >
                      {/* Left Column - Base Totals */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          Totales Base
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontWeight: 500 }}>Total Sueldo Base:</Typography>
                          <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>
                            ${reportData.totals.totalBaseSalary.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontWeight: 500 }}>Total Bono por Rol:</Typography>
                          <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>
                            ${reportData.totals.totalRoleBonus.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontWeight: 500 }}>Total Bono por Entregas:</Typography>
                          <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>
                            ${reportData.totals.totalDeliveryBonus.toFixed(2)}
                          </Typography>
                        </Box>
                        {reportData.totals.foodVouchers > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontWeight: 500 }}>
                              Vales de Despensa (4%):
                            </Typography>
                            <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>
                              +${reportData.totals.foodVouchers.toFixed(2)}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Right Column - Final Calculation */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          Cálculo Final
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontWeight: 500 }}>Sueldo Bruto:</Typography>
                          <Typography sx={{ fontWeight: 600, color: '#2e7d32' }}>
                            ${reportData.totals.grossSalary.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontWeight: 500 }}>ISR (9%):</Typography>
                          <Typography sx={{ fontWeight: 600, color: '#d32f2f' }}>
                            -${reportData.totals.isrBase.toFixed(2)}
                          </Typography>
                        </Box>
                        {reportData.totals.isrAdditional > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontWeight: 500 }}>ISR Adicional (3%):</Typography>
                            <Typography sx={{ fontWeight: 600, color: '#d32f2f' }}>
                              -${reportData.totals.isrAdditional.toFixed(2)}
                            </Typography>
                          </Box>
                        )}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            pt: 2,
                            borderTop: '2px solid #1976d2',
                            mt: 1,
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Sueldo Neto:
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: '#1976d2', fontSize: '1.5rem' }}
                          >
                            ${reportData.totals.netSalary.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        </FormContainer>
      </ContainerBox>
    </MainBox>
  );
};

export default ReportsPage;
