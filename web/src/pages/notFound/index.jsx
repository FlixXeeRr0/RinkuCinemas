import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: 120, fontWeight: 700, color: 'primary.main' }}>
        404
      </Typography>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Página no encontrada
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 4, maxWidth: 400 }}>
        Lo sentimos, la página que buscas no existe o ha cambiado.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ px: 4, py: 1.5 }}
      >
        <Typography variant='h6'>Volver al inicio</Typography>
      </Button>
    </Box>
  );
};

export default NotFoundPage;
