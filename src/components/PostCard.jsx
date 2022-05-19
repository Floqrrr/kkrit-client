import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMountEffect,
  useMemo,
} from "react";
import { useTheme } from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import {
  Box,
  Paper,
  Typography,
  Button,
  styled,
  Container,
  Avatar,
  Grid,
  CircularProgress,
  CardContent,
  Collapse,
  TextField,
  Card,
  Modal,
  IconButton,
  inputClasses,
  inputLabelClasses,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

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

const GradientPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  height: "0px",
  width: "230px",
  display: "flex",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  height: "100%",
  zIndex: 1,
  backgroundColor: "transparent",
  color: "white",
  backgroundImage: "linear-gradient(180deg,transparent,rgba(6,7,13,.5))",
  alignItems: "flex-start",
  justifyContent: "flex-end",
  flexDirection: "column",
  opacity: "0",
  "&:hover": {
    opacity: "1",
  },
}));

const LinkStyle = {
  textDecoration: "none",
  color: "white",
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

const MainCard = ({ todo }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [itemss, setItems] = useState([]);
  const [profile, setProfile] = useState([]);
  const [progress, setProgress] = useState(0);
  const [activity, setActivity] = useState();
  const [expanded, setExpanded] = React.useState(false);
  const [files, setFiles] = useState([]);

  const [openUpload, setOpenUpload] = React.useState(false);
  const handleOpen = () => setOpenUpload(true);
  const handleClose = () => setOpenUpload(false);

  const changeHandler = (event) => {
    setFormPost({ ...formPost, [event.target.name]: event.target.value });
    console.log(formPost);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 15
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    fetch(`/api/image/get_image/${todo.id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result);
          setFiles(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [todo.id]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const RemoD = (file) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles); // update the state
  };

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
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

  useEffect(() => {
    fetch(`/api/image/get_image/${todo.id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [todo.id]);

  useEffect(() => {
    fetch(`/api/auth/get_user`)
      .then((res) => res.json())
      .then(
        (result) => {
          setTimeout(() => {
            setProfile(result);
            setIsLoaded(true);
          }, 100);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  const { userId } = useContext(AuthContext);

  const getActivity = useCallback(async () => {
    try {
      await axios
        .get(`/api/activity/get_activity/${userId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setActivity(response.data));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getActivity();
  }, []);

  const [form, setForm] = useState({
    user_id: userId,
    post_id: todo.id,
    like: 0,
    watch: 0,
  });

  var date = new Date();

  var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timezone: "UTC",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const [formPost, setFormPost] = useState({
    id: todo.id,
    user_id: "",
    name: todo.name,
    title: todo.title,
    date_publication: date.toLocaleString("ru", options),
    image: "",
  });

  const createActivity = async () => {
    try {
      axios.put(
        "/api/activity/update_activity",
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const createWatch = async () => {
    try {
      axios.post(
        "/api/activity/create_activity",
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const updatepost = async () => {
    let formData = new FormData();

    files.map((item) => {
      formData.append("image", item);
      formData.append("id", todo.id);
    });

    handleClick();

    setOpenUpload(false);

    await axios.all([
      axios.put(
        "/api/post/update_post",
        { ...formPost },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
      axios.put("/api/post/update_image", formData),
    ]);
  };

  const checkLike = (post) => {
    let pst = activity.find((i) => i.post_id === post);

    console.log(activity);

    if (pst.like === 1) {
      form.like = -1;
      createActivity();
    } else {
      form.like = 1;
      createActivity();
    }
  };

  const checkWatch = async (post) => {
    var executed = false;
    let pst = activity.find((i) => i.post_id === post);

    console.log(pst);
    if (!executed) {
      executed = true;
      if (pst === undefined) {
        form.watch = 1;
        await createWatch();
      } else {
      }
    }
  };

  const deletePost = () => {
    axios.delete(`/api/image/delete_image/${todo.id}`);
  };

  const [openAlert, setOpenAlert] = React.useState(false);

  const handleClick = (message) => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
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

  return !isLoaded ? (
    <Grid item>
      <Card sx={{ position: "relative" }}>
        <Box
          a
          sx={{
            objectFit: "cover",
            height: "300px",
            display: "block",
            maxWidth: 300,
            width: "228px",
            overflow: "hidden",
          }}
        >
          <CircularProgress sx={{ml: 12, mt: 15}} variant="determinate" value={progress} />
        </Box>
      </Card>
    </Grid>
  ) : (
    <Grid item>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        message="обновлено"
        action={action}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          Пост обновлен!
        </Alert>
      </Snackbar>
      <Modal open={openUpload} onClose={handleClose}>
        <Box sx={modalstyle} {...getRootProps({ style })}>
          <Grid container sx={{ width: "255px", height: "auto" }}>
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
                  <img width={50} height={50} src={file.ref || file.preview} />

                  <ICButton
                    onClick={() => RemoD(file)}
                    sx={{ p: 0, ml: "-12px", mt: "-90px" }}
                  >
                    <CloseIcon sx={{ fill: "red", verticalAlign: "middle" }} />
                  </ICButton>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid sx={{ width: "300px", height: "auto", ml: 4, mb: "auto" }}>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "22px",
                textAlign: "center",
                mb: 5,
              }}
            >
              Редактирование поста
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
                defaultValue={todo.name}
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
                defaultValue={todo.title}
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
                  backgroundColor: "green",
                }}
                variant="contained"
                component="span"
                type="button"
                onClick={updatepost}
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
                  Обновить
                </Typography>
              </Button>
              <Button
                sx={{
                  p: 0,
                  height: "40px",
                  textAlign: "center",
                  boxShadow: "1px 1px 5px 0px black",
                  ml: 2,
                  backgroundColor: "red",
                }}
                variant="contained"
                component="span"
                type="button"
                onClick={deletePost}
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
                  Удалить
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Card sx={{ position: "relative" }}>
        {itemss.slice(0, 1).map((items) => (
          <Box key={items.id}>
            <Box
              component="img"
              a
              sx={{
                objectFit: "cover",
                height: "300px",
                display: "block",
                maxWidth: 300,
                width: "228px",
                overflow: "hidden",
              }}
              src={`${items.ref}?fit=cover&auto=format`}
              alt={items.label}
            ></Box>
            {/* </Link> */}

            <GradientPaper>
              <Grid container sx={{ justifyContent: "space-between" }}>
                <Grid container spacing={2} columns={16}>
                  <Grid item xs={8} mt={4}>
                    <Typography
                      noWrap
                      sx={{
                        ml: 2,
                        mb: 1,
                        fontWeight: 500,
                        display: "flex",
                        overflowX: "hidden",
                        width: "150px",
                      }}
                    >
                      <Button
                        onClick={() => checkWatch(todo.id)}
                        sx={{
                          color: "white",
                        }}
                      >
                        <Link to={`/post/${todo.id}`} style={LinkStyle}>
                          {todo.name}
                        </Link>
                      </Button>
                      {profile.map((item) =>
                        item.id === userId ? (
                          <Button
                            key={item.id}
                            onClick={handleOpen}
                            sx={{
                              display: "flex",
                              width: "25px",
                              minWidth: "25px",
                              height: "30px",
                              color: "white",
                            }}
                          >
                            <SettingsIcon />
                          </Button>
                        ) : null
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Box sx={{ mr: 1, ml: "60px", height: "28px" }}>
                      <Typography
                        sx={{
                          display: "flex",
                          fontWeight: 400,
                          fontSize: "14px",
                          alignItems: "center",
                        }}
                      >
                        {todo.count_watch}

                        <VisibilityIcon />
                      </Typography>
                    </Box>
                    <Box sx={{ mr: 1, ml: "60px", height: "28px" }}>
                      <Typography
                        sx={{
                          display: "flex",
                          fontWeight: 400,
                          fontSize: "14px",
                          alignItems: "center",
                        }}
                      >
                        {todo.count_message}
                        <Button
                          onClick={() => checkLike(todo.id)}
                          sx={{
                            display: "flex",
                            width: "25px",
                            minWidth: "25px",
                            height: "30px",
                            color: "white",
                          }}
                        >
                          <ChatBubbleOutlineIcon />
                        </Button>
                      </Typography>
                    </Box>
                    <Box sx={{ mr: 1, ml: "60px", height: "28px" }}>
                      <Typography
                        sx={{
                          display: "flex",
                          fontWeight: 400,
                          fontSize: "14px",
                          alignItems: "center",
                        }}
                      >
                        {todo.count_like}

                        <Button
                          onClick={() => checkLike(todo.id)}
                          sx={{
                            display: "flex",
                            width: "25px",
                            minWidth: "25px",
                            height: "30px",
                            color: "white",
                          }}
                        >
                          <FavoriteBorderIcon />
                        </Button>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid item sx={{ mr: 1, ml: "184px", height: "28px" }}></Grid>

                <Grid sx={{ height: "30px", mr: 1 }}>
                  {itemss.length == 1 ? (
                    <Button
                      onClick={handleExpandClick}
                      key={items.id}
                      sx={{
                        display: "flex",
                        fontWeight: 400,
                        fontSize: "14px",
                        alignItems: "center",
                        ml: "90px",
                        color: "white",
                        visibility: "collapse",
                      }}
                    ></Button>
                  ) : (
                    <Button
                      onClick={handleExpandClick}
                      sx={{
                        display: "flex",
                        fontWeight: 400,
                        fontSize: "14px",
                        alignItems: "center",
                        ml: "90px",
                        color: "white",
                      }}
                    >
                      <ExpandMoreIcon />
                    </Button>
                  )}
                </Grid>
              </Grid>
            </GradientPaper>
          </Box>
        ))}
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          sx={{ backgroundColor: "#06070d" }}
        >
          <CardContent
            sx={{
              p: 0,
              "&:last-child": {
                pb: 0,
                mt: 0,
                mt: "5px",
              },
            }}
          >
            {itemss.slice(1).map((items, index) => (
              <Box
                component="img"
                key={items.id}
                sx={{
                  objectFit: "cover",
                  height: "300px",
                  display: "block",
                  maxWidth: 300,
                  width: "228px",
                  overflow: "hidden",
                }}
                src={`${items.ref}?fit=cover&auto=format`}
                alt={items.label}
              ></Box>
            ))}
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

export default MainCard;
