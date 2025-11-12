import {
  Box,
  Button,
  styled,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { FaSearch, FaRegTrashAlt, FaSave } from 'react-icons/fa';
import { IoPersonAdd } from 'react-icons/io5';
import { CiEdit } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';
import CustomTextField from '../../components/CustomTextField';
import CustomSelect from '../../components/CustomSelect';

const MainBox = styled(Box)(({ theme }) => ({
  height: 'calc(100svh - 61px)',
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

const EmployeePage = () => {
  const [isEditActive, setIsEditActive] = useState(false);
  const [role, setRole] = useState('');
  const [employeeType, setEmployeeType] = useState('');

  const roles = [
    { value: '1', label: 'Chofer' },
    { value: '2', label: 'Cargador' },
    { value: '3', label: 'Auxiliar' },
  ];
  const tipos = [
    { value: '1', label: 'Interno' },
    { value: '2', label: 'Externo' },
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
            Empleados
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
          <Button
            variant="contained"
            size="large"
            startIcon={<IoPersonAdd />}
            sx={{ maxHeight: '36px' }}
          >
            Nuevo Empleado
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
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', padding: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ textAlign: 'start' }}>Número de empleado:</Typography>
                <CustomTextField id="employeeNumber" placeholder="Número de empleado" />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ textAlign: 'start' }}>Nombre completo:</Typography>
                <CustomTextField id="fullName" placeholder="Nombre completo" />
              </Box>

              <Box sx={{ display: 'flex', gap: 3, marginTop: 1 }}>
                {/* Select to choise a employee role */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ textAlign: 'start' }}>Rol:</Typography>
                  <CustomSelect
                    id="role"
                    placeholder="Selecciona un rol"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    options={roles}
                    onIconClick={() => console.log('Abrir opciones')}
                  />
                </Box>
                
                {/* Select to choise a employee type */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ textAlign: 'start' }}>Tipo:</Typography>
                  <CustomSelect
                    id="employeeType"
                    placeholder="Selecciona un tipo"
                    value={employeeType}
                    onChange={(e) => setEmployeeType(e.target.value)}
                    options={tipos}
                    onIconClick={() => console.log('Abrir opciones')}
                  />
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'end',
                height: '100%',
                gap: 2,
                padding: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  maxHeight: '36px',
                  background: isEditActive ? '#1976d2' : '#FFAB00',
                  '&:hover': {
                    background: isEditActive ? '#115293' : '#d99100',
                  },
                }}
                startIcon={isEditActive ? <FaSave /> : <CiEdit />}
                onClick={() => setIsEditActive(!isEditActive)}
              >
                {isEditActive ? 'Guardar' : 'Editar'}
              </Button>
              <Button
                variant="contained"
                sx={{
                  maxHeight: '36px',
                  background: '#CC1534',
                  '&:hover': {
                    background: '#ad122c',
                  },
                }}
                startIcon={isEditActive ? <IoMdClose /> : <FaRegTrashAlt />}
              >
                {isEditActive ? 'Cancelar' : 'Eliminar'}
              </Button>
            </Box>
          </Box>
        </FormContainer>
      </ContainerBox>
    </MainBox>
  );
};

export default EmployeePage;
