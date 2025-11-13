import { ThemeProvider, CssBaseline } from '@mui/material';
import "./App.css";
import defaultTheme from "./themes/defaultTheme.js";
import Routes from "./routes/route.jsx";
import CustomToastContainer from './components/CustomToastContainer/index.jsx';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <CustomToastContainer />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
