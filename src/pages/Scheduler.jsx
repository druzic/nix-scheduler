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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { supabase } from "../utils/supabase";

export function Scheduler() {
  const [selectedService, setSelectedService] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(dayjs(new Date()));
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [appointments, setAppointments] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [newClientForm, setNewClientForm] = React.useState({
    name: "",
    phoneNumber: "",
    instaTag: "",
  });
  const [clients, setClients] = React.useState([]);
  const addClientButtonRef = React.useRef(null);

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
  async function getClients() {
    const { data } = await supabase.from("clients").select();
    setClients(data);
  }
  // RESETIRANJE SELECT TIME AKO JE ZAUZET ZA TO VRIJEME
  React.useEffect(() => {
    getClients();
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

  const handleAddClient = async () => {
    if (!newClientForm.name.trim()) return;

    const newClient = {
      name: newClientForm.name.trim(),
      phoneNumber: newClientForm.phoneNumber.trim() || "",
      instaTag: newClientForm.instaTag.trim() || "",
    };

    const { data, error } = await supabase
      .from("clients")
      .insert({
        name: newClient.name,
        phone_number: newClient.phoneNumber,
        insta_tag: newClient.instaTag,
      })
      .select();

    setClients([...clients, newClient]);
    setSelectedClient(newClient.name);
    setOpenDialog(false);
    setNewClientForm({ name: "", phoneNumber: "", instaTag: "" });
  };

  const handleDialogOpen = () => {
    setNewClientForm({
      name: inputValue,
      phoneNumber: "",
      instaTag: "",
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewClientForm({ name: "", phoneNumber: "", instaTag: "" });
  };

  const handleSubmit = () => {
    try {
      const newAppointment = {
        clientName: selectedClient,
        serviceName: selectedService,
        date: selectedDate.format("DD-MM-YYYY"),
        time: selectedTime,
      };
      setAppointments([...appointments, newAppointment]);
      console.log("Radim");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <h1>Unos termina</h1>
      <div>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, mb: 2 }}>
          <Autocomplete
            freeSolo
            disablePortal
            options={clients.map((option) => option.name)}
            value={selectedClient}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) =>
              setInputValue(newInputValue)
            }
            onChange={(event, newValue) => setSelectedClient(newValue)}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Ime" />}
          />
          <Button
            ref={addClientButtonRef}
            variant="outlined"
            onClick={handleDialogOpen}
            sx={{ width: "fit-content" }}
          >
            + Novi klijent
          </Button>
        </Box>
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
        <Card
          variant="outlined"
          sx={{
            mt: 3,
            mb: 2,
            p: 2,
            backgroundColor: "#fafafa",
            borderRadius: 2,
          }}
        >
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            views={["year", "month", "day"]}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Card>
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
          onClick={handleSubmit}
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
        <Box sx={{ flexGrow: 1, m: 1 }}>
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
                        ? existingAppointment.clientName +
                          " - " +
                          existingAppointment.serviceName
                        : "Slobodno"}
                    </p>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </div>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        disableRestoreFocus
      >
        <DialogTitle>Dodaj novog klijenta</DialogTitle>
        <DialogContent
          sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            autoFocus
            label="Ime *"
            fullWidth
            value={newClientForm.name}
            onChange={(e) =>
              setNewClientForm({ ...newClientForm, name: e.target.value })
            }
            placeholder="Unesite ime klijenta"
          />
          <TextField
            label="Broj telefona"
            fullWidth
            value={newClientForm.phoneNumber}
            onChange={(e) =>
              setNewClientForm({
                ...newClientForm,
                phoneNumber: e.target.value,
              })
            }
            placeholder="Npr. 099123456"
          />
          <TextField
            label="Instagram tag"
            fullWidth
            value={newClientForm.instaTag}
            onChange={(e) =>
              setNewClientForm({ ...newClientForm, instaTag: e.target.value })
            }
            placeholder="Npr. @username"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Otkaži</Button>
          <Button
            onClick={handleAddClient}
            variant="contained"
            disabled={!newClientForm.name.trim()}
          >
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
