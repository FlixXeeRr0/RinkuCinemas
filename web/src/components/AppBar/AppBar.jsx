import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const StyledAppBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: theme.spacing(2),
  fontWeight: 700,
  fontSize: 20,
}));

const AppBarComponent = () => <StyledAppBar>App-bar</StyledAppBar>;

export default AppBarComponent;
