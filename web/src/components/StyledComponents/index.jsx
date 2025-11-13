import { Box, styled } from "@mui/material";

export const MainBox = styled(Box)(({ theme }) => ({
  height: 'calc(100svh - 61px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(1),
}));

export const ContainerBox = styled(Box)(({ theme }) => ({
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

export const BorderBottomContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
  width: '100%',
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '8px',
  width: '100%',
  height: '100%',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));
