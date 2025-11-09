import { ThemeProvider, CssBaseline } from '@mui/material';
import "./App.css";
import defaultTheme from "./themes/defaultTheme.js";
import Routes from "./routes/route.jsx";

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
