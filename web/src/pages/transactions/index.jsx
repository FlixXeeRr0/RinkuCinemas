import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  styled,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { FaSearch, FaRegTrashAlt, FaSave } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';
import CustomTextField from '../../components/CustomTextField';
import CustomSelect from '../../components/CustomSelect'; // 👈 asegúrate de tener este componente

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

const TransactionsPage = () => {
  const [isEditActive, setIsEditActive] = useState(false);
  const [coveredShift, setCoveredShift] = useState(false);
  const [employeeType, setEmployeeType] = useState('');

  const handleSearch = useCallback(() => {
    console.log('Buscando...');
  }, []);

  return (
    <MainBox>
      <ContainerBox>
        <BorderBottomContainer>
          <Typography variant="h4" sx={{ textAlign: 'start', fontWeight: 500 }}>
            Captura de movimientos
          </Typography>
        </BorderBottomContainer>

        {/** Finder */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 10, width: '100%' }}>
          <CustomTextField
            id="search"
            label="Buscar..."
            placeholder="Búsqueda por número de empleado"
            icon={<FaSearch />}
            onIconClick={handleSearch}
          />
        </Box>

        {/** Form */}
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
                <Box sx={{ display: 'flex', alignItems:'center', gap: 2, width: '50%' }}>
                  <Typography sx={{ textAlign: 'start' }}>Rol:</Typography>
                  <CustomTextField id="role" fullWidth />
                </Box>
                <Box sx={{ display: 'flex', alignItems:'center', gap: 2, width: '50%' }}>
                  <Typography sx={{ textAlign: 'start' }}>Tipo:</Typography>
                  <CustomTextField id="employeeType" fullWidth />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, marginTop: 1 }}>
                <Box sx={{ display: 'flex', alignItems:'center', gap: 2, width: '50%' }}>
                  <Typography sx={{ textAlign: 'start' }}>Fecha:</Typography>
                  <CustomTextField id="date" fullWidth />
                </Box>
                <Box sx={{ display: 'flex', alignItems:'center', gap: 2, width: '50%' }}>
                  <Typography sx={{ textAlign: 'start' }}>Número de entregas:</Typography>
                  <CustomTextField id="deliveries" />
                </Box>
              </Box>

              {/** Checkbox + Select */}
              <FormContainer sx={{ width: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, padding: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={coveredShift}
                        onChange={(e) => setCoveredShift(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Cubrió turno"
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '50%' }}>
                    <Typography sx={{ textAlign: 'start' }}>Tipo de empleado:</Typography>
                    <CustomSelect
                      id="employeeTypeSelect"
                      value={employeeType}
                      onChange={(e) => setEmployeeType(e.target.value)}
                      options={[
                        { value: 'operativo', label: 'Operativo' },
                        { value: 'administrativo', label: 'Administrativo' },
                        { value: 'temporal', label: 'Temporal' },
                      ]}
                      placeholder="Selecciona tipo..."
                      fullWidth
                    />
                  </Box>
                </Box>
              </FormContainer>
            </Box>

            {/** Action buttons */}
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
                    background: isEditActive ? '#0047b3' : '#d99100',
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

export default TransactionsPage;
