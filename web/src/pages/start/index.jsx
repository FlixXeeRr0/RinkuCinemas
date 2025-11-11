import { Box } from '@mui/material';

const StartPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100svh - 61px)'
      }}
    >
      <img
        src="/logo.png"
        alt="Logo"
        style={{ maxWidth: '300px', width: '50%', height: 'auto' }}
      />
    </Box>
  );
};

export default StartPage;
