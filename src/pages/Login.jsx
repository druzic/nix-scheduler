import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("test@gmail.com");
  const [password, setPassword] = React.useState("test123");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      console.log(error);
    } else {
      setUser(data.user);
      navigate("/scheduler");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", maxWidth: 400 }}
      >
        <h1 style={{ textAlign: "center" }}>Prijava</h1>

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          autoFocus
        />
        <TextField
          fullWidth
          label="Lozinka"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Prijavi se
        </Button>
      </Box>
    </Box>
  );
}
