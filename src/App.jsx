import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Scheduler } from "./pages/Scheduler";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/hr";
import dayjs from "dayjs";

dayjs.locale("hr");

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hr">
        <Router>
          <Routes>
            <Route
              path="/scheduler"
              element={
                <PrivateRoute>
                  <Scheduler />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
