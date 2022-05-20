import React, { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  FormControl,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

function ColorAlerts() {
  return (
    <Alert severity="success" color="info">
      This is a success alert — check it out!
    </Alert>
  );
}

const AuthPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const { login } = useContext(AuthContext);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log(form);
  };

  const handleClickShowPassword = () => {
    setForm({
      ...form,
      showPassword: !form.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const registerHandler = async () => {
    try {
      setTimeout(() => {
        window.location.href = '/auth';
      }, 2000);
      await axios.post(
        "/api/auth/registration",
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
    } catch (error) {
      console.log(error);
    }
  };

  let visual = false;

  const loginHandler = async () => {
    try {
      setTimeout(() => {
        window.location.href = '/';
      }, 2000)
      await axios
        .post(
          "/api/auth/login",
          { ...form },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          login(response.data.token, response.data.userId);
        });
    } catch (error) {
      visual = true;
      console.log(error);
      handleClick(error);
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClick = (message) => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box className="container">
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Ошибка входа"
        action={action}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Неверный логин или пароль!
        </Alert>
      </Snackbar>
      visual ? null :
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          background: "rgba(255, 255, 255)",

          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Авторизация
        </Typography>
        <form onSubmit={(e) => e.preventDefault()}>
          <FormControl
            sx={{
              width: "100%",
              ".MuiTextField-root": {
                background: "rgb(66 66 66 / 20%)",
                borderRadius: "5px",
              },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0)",
                border: "none",
              },
            }}
          >
            <TextField
              sx={{
                width: "100%",
                ".MuiInputLabel-root": {
                  color: "black",
                },
                ".Mui-focused": {
                  color: "black",
                },
                ".MuiOutlinedInput-root": {
                  color: "black",
                },
              }}
              margin="normal"
              label="E-mail"
              type="email"
              name="email"
              className="validate"
              onChange={changeHandler}
            />
            <TextField
              sx={{
                width: "100%",
                mb: 2,
                mt: 2,
                color: "white",
                visible: true,
                ".MuiInputLabel-root": {
                  color: "black",
                },
                ".Mui-focused": {
                  color: "black",
                },
                ".MuiOutlinedInput-root": {
                  color: "black",
                },
              }}
              variant="outlined"
              margin="normal"
              label="Пароль"
              type={form.showPassword ? "text" : "password"}
              value={form.password}
              name="password"
              className="validate"
              onChange={changeHandler}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{
                        color: "rgb(66 66 66)",
                      }}
                    >
                      {form.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{
                mb: "16px",
                background: "linear-gradient(45deg, #87CEEB 30%, #7e8bff 90%)",
                border: 0,
                borderRadius: "5px",
                boxShadow: "0 3px 5px 2px rgba(126,	139,	255, .3)",
                color: "white",
                height: 48,
                padding: "0 30px",
                width: "100%",
              }}
              onClick={loginHandler}
            >
              Войти
            </Button>
            <Grid container sx={{ px: "5px" }}>
              <Grid item xs>
                <Link href="/resetpass" sx={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "black" }}>
                    Забыли пароль?
                  </Typography>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" sx={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "black" }}>
                    Нет учетной записи?
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </FormControl>
        </form>
      </Box>
    </Box>
  );
};

export default AuthPage;
