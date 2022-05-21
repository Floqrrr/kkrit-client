import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Button,
  Menu,
  MenuItem,
  styled,
  alpha,
  Divider,
  Modal,
  TextField,
  Grid,
  inputClasses,
  inputLabelClasses,
  InputBase,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import { AuthContext } from "../context/AuthContext";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import axios from "axios";
import UploadIcon from "@mui/icons-material/Upload";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "500px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "auto",
    [theme.breakpoints.up("md")]: {
      width: "444px",
    },
  },
}));

const ICButton = styled(
  IconButton,
  CloseIcon
)(({ theme }) => ({
  "&:hover": {
    CloseIcon: {
      display: "block",
    },
  },
}));

const TextFieldd = styled(TextField)(`

  .${inputClasses.root} {
    font-size: 18px;
    color: black;
    
  }
  .${inputLabelClasses.root} {
    font-size: 18px;
    color: black;
    &.${inputLabelClasses.focused} {
      color: grey;
    }
  }
`);

const modalstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  height: "max-content",
  color: "white",
};

const baseStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "20px",
  borderRadius: 5,
  background: "#202020",
  color: "#white",
  transition: "border .3s ease-in-out",
  noClick: "false",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const LinkStyle = {
  margin: "1rem",
  textDecoration: "none",
  color: "white",
};

function Header() {
  const { userId } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [isLoadedProfile, setIsLoadedProfile] = useState(false);
  const [profile, setProfile] = useState();

  var date = new Date();

  var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  };

  const [form, setForm] = useState({
    user_id: "",
    name: "",
    title: "",
    date_publication: date.toLocaleString("ru", options),
    image: "",
  });

  const { user_id, name, title, date_publication, image } = form;

  form.user_id = JSON.stringify(userId);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { logout, isLogin } = useContext(AuthContext);

  let setValue;

  if (isLogin) {
    setValue = "Выйти";
  } else {
    setValue = "Войти";
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
  };

  const [openUpload, setOpenUpload] = useState(false);
  const handleOpen = () => setOpenUpload(true);
  const handleClose = () => setOpenUpload(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const maxLength = 10485760;

  function nameLengthValidator(file) {
    console.log(file);
    if (file.size > maxLength) {
      return {
        code: "too-many-files",
        message: `Размер не должен быть больше ${maxLength} Byte`,
      };
    }

    return null;
  }

  const {
    getRootProps,
    getInputProps,
    open,
    fileRejections,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 5,
    onDrop,
    validator: nameLengthValidator,
    type: "image",
    noClick: true,
    noKeyboard: true,
    accept: "image/jpeg, image/png",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  // clean up
  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const RemoD = (file) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles); // update the state
  };

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    fetch(`/api/auth/get_user_header/${userId}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setProfile(result);
          setIsLoadedProfile(true);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  form.image = files;

  const trynow = async () => {
    let formData = new FormData();

    files.map((item) => {
      formData.append("image", item);
    });

    if (form.name === "") {
      handleClickAlertFalseName();
    } else
      try {
        handleClickAlert();
        setOpenUpload(false);
        await axios.all([
          axios.post(
            "/api/post/create_post",
            { ...form },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          ),

          axios.post("/api/post/create_image", formData),
        ]);
      } catch (error) {
        console.log(error);
      }
  };

  const addPost = async () => {
    await trynow();
  };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [openAlertFalse, setOpenAlertFalse] = React.useState(false);
  const [openAlertFalseName, setOpenAlertFalseName] = React.useState(false);

  const handleClickAlert = (message) => {
    setOpenAlert(true);
  };

  const handleClickAlertFalse = (message) => {
    setOpenAlertFalse(true);
  };

  const handleClickAlertFalseName = (message) => {
    setOpenAlertFalseName(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleCloseAlertFalse = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlertFalse(false);
  };

  const handleCloseAlertFalseName = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlertFalseName(false);
  };

  useEffect(() => {
    if (fileRejections.length != 0) {
      handleClickAlertFalse();
      open();
    }
  });

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

  return isLoadedProfile ? (
    <Box sx={{ flexGrow: 1 }}>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        message=" Изображение загружено"
        action={action}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          Пост добавлен
        </Alert>
      </Snackbar>

      <Snackbar
        open={openAlertFalse}
        autoHideDuration={6000}
        onClose={handleCloseAlertFalse}
        message=" Изображение загружено"
        action={action}
      >
        <Alert
          onClose={handleCloseAlertFalse}
          severity="error"
          sx={{ width: "100%" }}
        >
          Не добавляйте в один пост более чем 6 картинок!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openAlertFalseName}
        autoHideDuration={6000}
        onClose={handleCloseAlertFalseName}
        message=" Изображение загружено"
        action={action}
      >
        <Alert
          onClose={handleCloseAlertFalseName}
          severity="error"
          sx={{ width: "100%" }}
        >
          Добавьте название поста!
        </Alert>
      </Snackbar>
      <AppBar position="fixed">
        <Toolbar>
          <Avatar
            component="a"
            href="/"
            alt="logo"
            src={require("../logo.png")}
            sx={{ mr: 1, mb: 1, width: 90, height: 90 }}
          />

          <Typography
            component="a"
            href="/"
            variant="h4"
            sx={{
              letterSpacing: "-1px",
              textDecoration: "none",
              color: "black",
            }}
          >
            ККРИТ
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {isLogin ? (
            <>
              <Modal
                open={openUpload}
                onClose={handleClose}
                sx={{
                  background:
                    "linear-gradient(34deg, rgb(126 139 255 / 70%) 0%, rgb(255 255 255 / 70%) 100%)",
                  color: "#7e8bff",
                }}
              >
                <Box sx={modalstyle} {...getRootProps({ style })}>
                  <Grid
                    container
                    sx={{
                      width: "255px",
                      height: "auto",
                    }}
                  >
                    <Grid
                      item
                      sx={{
                        width: "250px",
                        height: "400px",
                        ml: 2,
                        display: "flex",
                        flexDirection: "column",
                        p: 1,
                        background:
                          "linear-gradient(34deg, rgb(235 110 110 / 70%) 0%, rgb(119 150 173 / 70%) 100%)",
                        borderRadius: 2,
                        boxShadow: "5px 5px 20px 0px black",
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        name="image"
                        id="file"
                        accept="image/gif , image/png , image/jpeg"
                        {...getInputProps()}
                      />
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{
                          py: 15,
                          textAlign: "center",

                          color: "white",
                          fontSize: 20,
                          fontWeight: 500,
                          border: "3px dashed hsla(0,0%,100%,.4)",
                          borderRadius: 1,
                        }}
                      >
                        Перетащите изображение <br /> или нажмите сюда
                        <br />
                        <Button
                          sx={{
                            mt: 1,
                            p: 0,
                            height: "35px",
                            minWidth: "35px",
                            textAlign: "center",
                            background: "#26262669",
                            borderRadius: 50,
                          }}
                          variant="contained"
                          component="span"
                          color="secondary"
                          type="button"
                          onClick={open}
                        >
                          <UploadIcon />
                        </Button>
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      sx={{
                        height: "max-content",
                        width: "100%",
                        lineHeight: "20px",
                        ml: "40px",
                        mt: "20px",
                      }}
                    >
                      {files.map((file) => (
                        <Grid
                          key={file.path}
                          item
                          sx={{ width: "max-content", mr: "7px", mb: 1 }}
                        >
                          <img width={50} height={50} src={file.preview} />

                          <ICButton
                            onClick={() => RemoD(file)}
                            sx={{ p: 0, ml: "-12px", mt: "-90px" }}
                          >
                            <CloseIcon
                              sx={{ fill: "red", verticalAlign: "middle" }}
                            />
                          </ICButton>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid
                    sx={{ width: "300px", height: "auto", ml: 4, mb: "auto" }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "600",
                        fontSize: "22px",
                        textAlign: "center",
                        mb: 5,
                      }}
                    >
                      Добавление поста
                    </Typography>
                    <Grid item>
                      <TextFieldd
                        sx={{
                          width: "100%",
                          lineHeight: "20px",
                          mb: "5px",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.4rem",
                          boxShadow: "1px -1px 5px 0px black",

                          ".MuiInputLabel-root": {
                            color: "rgb(255 255 255)",
                          },
                          ".MuiFilledInput-root": {
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            color: "rgb(255 255 255 / 80%)",
                            backgroundColor: "rgb(60 60 60)",
                          },
                        }}
                        label="Название"
                        name="name"
                        variant="filled"
                        onChange={changeHandler}
                      />
                    </Grid>
                    <Grid item>
                      <TextFieldd
                        sx={{
                          width: "100%",
                          lineHeight: "50px",
                          fontSize: "1.2rem",
                          mb: "100px",
                          boxShadow: "1px 1px 5px 0px black",

                          ".MuiInputLabel-root": {
                            color: "rgb(255 255 255)",
                          },
                          ".MuiFilledInput-root": {
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            color: "rgb(255 255 255 / 80%)",
                            backgroundColor: "rgb(60 60 60)",
                          },
                        }}
                        rows={4}
                        multiline
                        label="Описание"
                        name="title"
                        variant="filled"
                        onChange={changeHandler}
                      />
                    </Grid>
                    <Grid item sx={{ textAlign: "center" }}>
                      <Button
                        sx={{
                          p: 0,
                          height: "40px",
                          textAlign: "center",
                          boxShadow: "1px 1px 5px 0px black",
                        }}
                        variant="contained"
                        component="span"
                        color="secondary"
                        type="button"
                        onClick={addPost}
                      >
                        <Typography
                          variant="span"
                          sx={{
                            color: "white",
                            fontSize: 13,
                            p: "5px",
                            borderRadius: 2,
                          }}
                        >
                          Опубликовать
                        </Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>

              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <Button
                  onClick={handleOpen}
                  variant="contained"
                  component="span"
                  color="secondary"
                  sx={{ mt: 0.45, height: "40px", textAlign: "center" }}
                >
                  <AddAPhotoOutlinedIcon sx={{ mb: "3px" }} />
                </Button>
                <IconButton
                  size="large"
                  aria-label="show new mails"
                  color="inherit"
                  sx={{ ml: 1 }}
                  component={Link}
                  to={`/chat`}
                  onClick={() =>
                    setTimeout(() => {
                      window.location.reload();
                    }, 100)
                  }
                >
                  <Badge badgeContent={0} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="show new notifications"
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={0} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <IconButton
                  onClick={handleOpenUserMenu}
                  size="large"
                  aria-label="show avatar"
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar
                    alt=""
                    src={`${profile?.map((item) => item.avatar)}`}
                    sx={{ width: 40, height: 40, ml: 1 }}
                  />
                </IconButton>
                <Menu
                  sx={{ mt: "50px", width: "0 auto" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Typography
                    sx={{ fontSize: 20, fontWeight: 500, ml: 3, mb: 1, mr: 3 }}
                  >
                    {profile.map((item) => item.nickname)}
                  </Typography>
                  <Divider />
                  <MenuItem
                    component={Link}
                    to={`/user/${userId}`}
                    sx={{ ml: 1, mt: 1, mr: 1 }}
                    onClick={() =>
                      setTimeout(() => {
                        window.location.reload();
                      }, 100)
                    }
                  >
                    <Typography textAlign="center">Профиль</Typography>
                  </MenuItem>
                  <MenuItem sx={{ ml: 1, mt: 1, mr: 1 }} onClick={handleLogout}>
                    <Typography textAlign="center">{setValue}</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Link style={LinkStyle} to="/auth">
              <Button
                variant="contained"
                component="span"
                color="secondary"
                sx={{ ml: "15px", height: "40px", textAlign: "center" }}
              >
                Войти
              </Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  ) : (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Avatar
            component="a"
            href="/"
            alt="logo"
            src={require("../logo.png")}
            sx={{ mr: 1, mb: 1, width: 90, height: 90 }}
          />

          <Typography
            component="a"
            href="/"
            variant="h4"
            sx={{
              letterSpacing: "-1px",
              textDecoration: "none",
              color: "black",
            }}
          >
            ККРИТ
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default Header;
