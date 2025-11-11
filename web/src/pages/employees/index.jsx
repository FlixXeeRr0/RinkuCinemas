import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  styled,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { FaSearch, FaRegTrashAlt, FaSave } from 'react-icons/fa';
import { IoPersonAdd } from 'react-icons/io5';
import { CiEdit } from 'react-icons/ci';
import { IoMdClose } from "react-icons/io";
import CustomTextField from '../../components/CustomTextField';

const MainBox = styled(Box)(({ theme }) => ({
  height: 'calc(100svh - 61px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(1),
}));

const ContainerBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  height: '80%',
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

  const handleSearch = useCallback(() => {
    console.log('Buscando...');
  });

  return (
    <MainBox>
      <ContainerBox>
        <BorderBottomContainer>
          <Typography variant="h4" sx={{ textAlign: 'start', fontWeight: 500 }}>
            Empleados
          </Typography>
        </BorderBottomContainer>

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

        <FormContainer>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexDirection: ' column', padding: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ textAlign: 'start' }}>Número de empleado:</Typography>
                <CustomTextField id="employeeNumber" placeholder="Número de empleado" />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ textAlign: 'start' }}>Nombre completo:</Typography>
                <CustomTextField id="fullName" placeholder="Nombre completo" />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '5%' }}>
                <Box sx={{ width: '35%' }}>
                  <FormContainer sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ textAlign: 'center', width: '50%' }} variant="h6">
                      Rol:
                    </Typography>
                    <FormGroup sx={{ width: '50%' }}>
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Chofer" />
                      <FormControlLabel control={<Checkbox />} label="Cargador" />
                      <FormControlLabel control={<Checkbox />} label="Auxiliar" />
                    </FormGroup>
                  </FormContainer>
                </Box>

                <Box sx={{ width: '35%' }}>
                  <FormContainer sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ textAlign: 'center', width: '50%' }} variant="h6">
                      Tipo:
                    </Typography>
                    <FormGroup sx={{ width: '50%' }}>
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Interno" />
                      <FormControlLabel control={<Checkbox />} label="Externo" />
                    </FormGroup>
                  </FormContainer>
                </Box>
              </Box>
            </Box>

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
                  background: isEditActive ? 'primary.main' : '#FFAB00',
                  '&:hover': {
                    background: isEditActive ? 'blue[700]' : '#e69a00',
                  },
                }}
                startIcon={isEditActive ? <FaSave /> : <CiEdit />}
                onClick={() => setIsEditActive(!isEditActive)}
              >
                {isEditActive ? 'Guardar' : 'Editar'}
              </Button>
              <Button
                variant="contained"
                sx={{ maxHeight: '36px', background: '#ad122c' }}
                startIcon={(isEditActive) ? <IoMdClose /> : <FaRegTrashAlt />}
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
