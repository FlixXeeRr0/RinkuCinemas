import { Box, styled } from '@mui/material';

export const MainBox = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 61px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: theme.spacing(1),
  paddingTop: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
  },
}));

export const ContainerBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  width: '100%',
  padding: theme.spacing(2),
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    width: '95%',
    padding: theme.spacing(3),
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    width: '90%',
    maxWidth: '1200px',
  },
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
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));
