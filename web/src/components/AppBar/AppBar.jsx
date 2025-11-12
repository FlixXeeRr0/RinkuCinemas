import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FaHome, FaUsers, FaClipboardList } from 'react-icons/fa';
import { GiArchiveRegister } from 'react-icons/gi';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import MenuEnum from '../../enums/MenuEnum';

const StyledAppBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: theme.spacing(1),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
}));

const CustomButton = styled(Button)(({ theme }) => ({
  cursor: 'pointer',
}));

const AppBarComponent = () => {
  const navigate = useNavigate();

  return (
    <StyledAppBar>
      <CustomButton
        variant="contained"
        startIcon={<FaHome />}
        onClick={() => navigate(MenuEnum.START_PAGE)}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Inicio
        </Typography>
      </CustomButton>

      <CustomButton
        variant="contained"
        startIcon={<FaUsers />}
        onClick={() => navigate(MenuEnum.EMPLOYEES_PAGE)}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Empleados
        </Typography>
      </CustomButton>

      <CustomButton
        variant="contained"
        startIcon={<GiArchiveRegister />}
        onClick={() => navigate(MenuEnum.TRANSACTIONS_PAGE)}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Captura
        </Typography>
      </CustomButton>

      <CustomButton
        variant="contained"
        startIcon={<FaClipboardList />}
        onClick={() => navigate(MenuEnum.REPORT_PAGE)}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Reportes
        </Typography>
      </CustomButton>
    </StyledAppBar>
  );
};

export default AppBarComponent;
