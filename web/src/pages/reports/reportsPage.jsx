import { Box, Button, styled, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import CustomTextField from '../../components/CustomTextField';
import CustomSelect from '../../components/CustomSelect';
import CustomTable from '../../components/CustomTable';

const MainBox = styled(Box)(({ theme }) => ({
  height: 'calc(100svh - 61px)',
  overflow: 'scroll',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(1),
}));

const ContainerBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  width: '80%',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
}));

const BorderBottomContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
  width: '100%',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '8px',
  width: '100%',
  height: '100%',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const ReportsPage = () => {
  const [isEditActive, setIsEditActive] = useState(false);
  const [month, setMonth] = useState('');
  const [year, setYeaer] = useState('');

  const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];
  const years = [
    { value: '1', label: '2024' },
    { value: '2', label: '2025' },
  ];

  const columns = [
    { field: 'name', label: 'Postre' },
    { field: 'calories', label: 'Calorías', align: 'right' },
    { field: 'fat', label: 'Grasa (g)', align: 'right' },
    { field: 'carbs', label: 'Carbohidratos (g)', align: 'right' },
    { field: 'protein', label: 'Proteína (g)', align: 'right' },
  ];

  const rows = [
    { name: 'Frozen yoghurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
    { name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
    { name: 'Eclair', calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
    { name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
    { name: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49, protein: 3.9 },
  ];

  const handleSearch = useCallback(() => {
    console.log('Buscando...');
  }, []);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  return (
    <MainBox>
      <ContainerBox>
        <BorderBottomContainer>
          <Typography variant="h4" sx={{ textAlign: 'start', fontWeight: 500 }}>
            Reporte de movimientos y saldos
          </Typography>
        </BorderBottomContainer>

        {/* Finder */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 10, width: '100%' }}>
          <CustomTextField
            id="search"
            label="Buscar..."
            placeholder="Búsqueda por número de empleado"
            icon={<FaSearch />}
            onIconClick={handleSearch}
          />
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
            <BorderBottomContainer
              sx={{ display: 'flex', gap: 2, flexDirection: 'column', padding: 2 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ textAlign: 'start' }}>Número de empleado:</Typography>
                <CustomTextField id="employeeNumber" placeholder="Número de empleado" />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ textAlign: 'start' }}>Nombre completo:</Typography>
                <CustomTextField id="fullName" placeholder="Nombre completo" />
              </Box>

              <Box sx={{ display: 'flex', gap: 3, marginTop: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '50%' }}>
                  <Typography sx={{ textAlign: 'start' }}>Rol:</Typography>
                  <CustomTextField id="role" fullWidth />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '50%' }}>
                  <Typography sx={{ textAlign: 'start' }}>Tipo:</Typography>
                  <CustomTextField id="employeeType" fullWidth />
                </Box>
              </Box>
            </BorderBottomContainer>

            <Box sx={{ display: 'flex', gap: 3, marginTop: 1, padding: 2 }}>
              {/* Select to choise a month */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ textAlign: 'start' }}>Mes:</Typography>
                <CustomSelect
                  id="month"
                  placeholder="Selecciona un mes"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  options={months}
                  onIconClick={() => console.log('Abrir opciones')}
                />
              </Box>

              {/* Select to choise a year */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ textAlign: 'start' }}>Año:</Typography>
                <CustomSelect
                  id="year"
                  placeholder="Selecciona un año"
                  value={year}
                  onChange={(e) => setYeaer(e.target.value)}
                  options={years}
                  onIconClick={() => console.log('Abrir opciones')}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2, gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  maxHeight: '36px',
                }}
                onClick={() => setIsEditActive(!isEditActive)}
              >
                Consultar
              </Button>

              <CustomTable columns={columns} rows={rows} />
            </Box>
          </Box>
        </FormContainer>
      </ContainerBox>
    </MainBox>
  );
};

export default ReportsPage;
