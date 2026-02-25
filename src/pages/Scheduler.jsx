import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export function Scheduler() {
  const [selectedService, setSelectedService] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(dayjs(new Date()));
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [appointments, setAppointments] = React.useState([
    {
      clientName: "Ana",
      serviceName: "Lak",
      date: dayjs().format("DD-MM-YYYY"),
      time: "10:15",
    },
  ]);

  const clients = [
    { name: "Ana", phoneNumber: "099123456", instaTag: "@ana" },
    { name: "Iva", phoneNumber: "099123456", instaTag: "@iva" },
  ];
  const services = [
    {
      name: "Lak",
      price: 30,
    },
    { name: "Pedikura", price: 40 },
  ];
  const timeSlots = [
    "08:00",
    "08:45",
    "09:30",
    "10:15",
    "11:00",
    "11:45",
    "12:30",
    "13:15",
    "14:00",
    "14:45",
    "15:30",
    "16:15",
    "17:00",
    "17:45",
    "18:30",
    "19:15",
  ];

  // Resetiraj selectedTime ako je taj slot zauzet na novom datumu
  React.useEffect(() => {
    if (selectedTime) {
      const isBooked = appointments.find(
        (app) =>
          app.time === selectedTime &&
          app.date === selectedDate.format("DD-MM-YYYY"),
      );
      if (isBooked) {
        setSelectedTime("");
        // TU TREBAM JEDAN TOSTIFY UBACIT OBAVIJEST MOZDA
      }
    }
  }, [selectedDate, appointments, selectedTime]);

  return (
    <div>
      <h1>Unos termina</h1>
      <div>
        <Autocomplete
          freeSolo
          disablePortal
          options={clients.map((option) => option.name)}
          value={selectedClient}
          onChange={(event, newValue) => setSelectedClient(newValue)}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Ime" />}
        />
        <div className="py-3">
          <FormControl fullWidth>
            <InputLabel>Usluga</InputLabel>
            <Select
              id="outlined-select"
              label="Usluga"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {services.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name} - {option.price}€
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <DateCalendar
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          views={["year", "month", "day"]}
        />
        <p>Odabrano: {selectedDate.format("dddd, DD.MM.YYYY.")}</p>

        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Trenutni odabir
            </Typography>
            <Typography variant="body2">
              <strong>Klijent:</strong> {selectedClient || "—"}
            </Typography>
            <Typography variant="body2">
              <strong>Datum:</strong>{" "}
              {selectedDate
                ? dayjs(selectedDate).format("dddd, DD.MM.YYYY.")
                : "—"}
            </Typography>
            <Typography variant="body2">
              <strong>Vrijeme:</strong> {selectedTime || "—"}
            </Typography>
            <Typography variant="body2">
              <strong>Usluga:</strong> {selectedService || "—"}
            </Typography>
          </CardContent>
        </Card>
        <Button
          variant="contained"
          disabled={!selectedClient || !selectedTime || !selectedService}
        >
          Spremi
        </Button>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            m: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{ minWidth: "44px", width: "44px", height: "44px", padding: 0 }}
            onClick={() => setSelectedDate(selectedDate.subtract(1, "day"))}
          >
            ←
          </Button>
          <Button
            variant="contained"
            sx={{ minWidth: "60px", height: "44px" }}
            onClick={() => setSelectedDate(dayjs())}
          >
            Danas
          </Button>
          <Button
            variant="contained"
            sx={{ minWidth: "44px", width: "44px", height: "44px", padding: 0 }}
            onClick={() => setSelectedDate(selectedDate.add(1, "day"))}
          >
            →
          </Button>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
            {selectedDate.format("DD.MM.YYYY")}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, m: 2 }}>
          <Grid container spacing={1}>
            {timeSlots.map((time) => {
              const existingAppointment = appointments.find(
                (app) =>
                  app.time === time &&
                  app.date === selectedDate.format("DD-MM-YYYY"),
              );

              return (
                <Grid size={6} key={time}>
                  <Paper
                    sx={{
                      backgroundColor: existingAppointment
                        ? "#ffcdd2"
                        : time === selectedTime
                          ? "#a5d6a7"
                          : "white",
                    }}
                    className=" border py-2 rounded-sm pl-1"
                    onClick={() => {
                      if (!existingAppointment) {
                        setSelectedTime(time);
                      }
                    }}
                  >
                    <strong>{time}</strong>
                    <p>
                      {existingAppointment
                        ? existingAppointment.clientName
                        : "Slobodno"}
                    </p>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </div>
    </div>
  );
}
