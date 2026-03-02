import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { supabase } from "../utils/supabase";

export function ClientDetails() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [client, setClient] = React.useState(null);
  const [appointments, setAppointments] = React.useState([]);

  const columns = React.useMemo(
    () => [
      { field: "date", headerName: "Datum", flex: 1, minWidth: 95 },
      { field: "time", headerName: "Vrijeme", flex: 0.8, minWidth: 75 },
      { field: "service", headerName: "Usluga", flex: 1.1, minWidth: 105 },
    ],
    [],
  );

  const rows = React.useMemo(
    () =>
      appointments.map((appointment) => ({
        dateTime: dayjs(
          `${appointment.date.split("-").reverse().join("-")}T${appointment.time}`,
        ),
        id: appointment.id,
        date: dayjs(appointment.date, "DD-MM-YYYY").format("DD.MM.YYYY"),
        time: appointment.time,
        service: appointment.service_name,
      })),
    [appointments],
  );

  React.useEffect(() => {
    async function loadClientDetails() {
      if (!clientId) return;

      const [{ data: clientData }, { data: appointmentData }] =
        await Promise.all([
          supabase.from("clients").select().eq("id", clientId).maybeSingle(),
          supabase
            .from("appointments")
            .select()
            .eq("client_id", clientId)
            .order("date", { ascending: true })
            .order("time", { ascending: true }),
        ]);

      setClient(clientData || null);
      setAppointments(appointmentData || []);
    }

    loadClientDetails();
  }, [clientId]);

  return (
    <Box sx={{ p: 2 }}>
      <Button
        variant="outlined"
        sx={{ mb: 2 }}
        onClick={() => navigate("/scheduler")}
      >
        ← Natrag
      </Button>

      <Typography variant="h5" sx={{ mb: 2 }}>
        {client?.name || "Klijent"}
      </Typography>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="body2">
            <strong>Telefon:</strong> {client?.phone_number || "—"}
          </Typography>
          <Typography variant="body2">
            <strong>Instagram:</strong> {client?.insta_tag || "—"}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Termini
      </Typography>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          disableRowSelectionOnClick
          getRowClassName={(params) => {
            if (params.row.dateTime.isAfter(dayjs())) return "future-row";
            if (params.row.dateTime.isBefore(dayjs())) return "past-row";
            return "";
          }}
          autoHeight
          density="compact"
          rowHeight={36}
          columnHeaderHeight={40}
          sx={{
            "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
            "& .MuiDataGrid-cell": {
              px: { xs: 0.5, sm: 1 },
            },
            "& .MuiDataGrid-columnHeader": {
              px: { xs: 0.5, sm: 1 },
            },
            "& .future-row": {
              backgroundColor: (theme) => theme.palette.warning.light,
            },
            "& .future-row:hover": {
              backgroundColor: (theme) => theme.palette.warning.dark,
            },
            "& .past-row": {
              backgroundColor: (theme) => theme.palette.grey[200],
            },
            "& .past-row:hover": {
              backgroundColor: (theme) => theme.palette.grey[500],
            },
          }}
          localeText={{ noRowsLabel: "Nema termina za ovog klijenta." }}
        />
      </Box>
    </Box>
  );
}
