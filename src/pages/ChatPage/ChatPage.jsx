import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  MenuItem,
  TextField,
  Grid,
  FormControl,
  Select,
  styled,
  CircularProgress,
  ImageList,
  ImageListItem,
  FormGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import GifBoxIcon from "@mui/icons-material/GifBox";
import bgImage from "../../post_bg.svg";
import axios from "axios";
import Message from "../../components/Message";

import { AuthContext } from "../../context/AuthContext";
import dateFormat, { masks } from "dateformat";

function ChatPage() {
  const [value, setValue] = React.useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [room, setRoom] = useState(0);
  const [dialog, setDialog] = useState([]);
  const [message, setMessage] = useState();
  const [users, setUsers] = useState();
  const [progress, setProgress] = useState(0);
  const [usersId, setUsersId] = useState(0);

  const { userId } = useContext(AuthContext);

  const getDialog = useCallback(async () => {
    try {
      await axios
        .get(`/api/chat/get_dialog/${userId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setDialog(response.data));
      setIsLoaded(true);
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getDialog();
  }, [dialog]);

  useEffect(() => {
    fetch(`/api/auth/get_user`)
      .then((res) => res.json())
      .then(
        (result) => {
          setUsers(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timezone: "UTC",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  var date = new Date();

  const [form, setForm] = useState({
    user_from_id: userId,
    user_to_id: "",
    dialog_id: room,
    message: "",
    date_publication: date.toLocaleString("ru", options),
  });

  const openChat = (roomId, userId) => {
    setRoom(roomId);
    setUsersId(userId);
    console.log(usersId);
  };

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log(form);
  };

  const sendMessage = async () => {
    form.dialog_id = room;
    form.user_to_id = dialog.find((item) => item.id === room).user_to_id;
    try {
      await axios.post(
        "/api/chat/create_message",
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

  return !isLoaded ? (
    <CircularProgress variant="determinate" value={progress} />
  ) : (
    <Box container id="msg_container">
      <Grid
        container
        sx={{
          ml: "260px",
          mt: "100px",
          width: "1400px",
          height: "50px",
          flexDirection: "row",
          borderBottom: "1px solid #232326",
        }}
      >
        <Grid
          item
          sx={{
            backgroundColor: "#2e3035",
            borderRight: "1px solid #232326",
            padding: "0 20px",
            height: "100%",
            flex: "0 1 55px",
          }}
        >
          <Box>
            <Typography
              sx={{
                height: "100%",
                color: "white",
                width: "425px",
                mt: "15px",
                textAlign: "center",
              }}
            >
              Диалоги
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          sx={{
            backgroundColor: "#2e3035",
            borderBottom: "1px solid #232326",
            borderRight: "1px solid #232326",
            padding: "0 20px",
            height: "100%",
            flex: "0 1 55px",
          }}
        >
          <Box>
            <Typography
              sx={{
                height: "100%",
                color: "white",
                mt: "15px",
                width: "893px",
              }}
            >
              {users?.map((usr) =>
                usr.id === usersId ? (
                  <Typography sx={{ color: "white" }}>
                    {usr.nickname}
                  </Typography>
                ) : null
              )}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        id="msg_list"
        sx={{
          margin: "0px auto 0 -700px",
          width: "1400px",
          position: "absolute",
          right: "auto",
          left: "50%",
        }}
      >
        <Grid
          item
          sx={{
            backgroundColor: "#212124",
            borderRight: "1px solid #232326",
            height: "100%",
            width: "80px",
            float: "left",
            display: "flex",
            flexFlow: "column",
            top: "0",
            right: "0",
          }}
          xs={4}
        >
          {dialog?.map((item) =>
            users?.map((usr) =>
              usr.id === item.user_to_id && usr.id != userId ? (
                <Box
                  sx={{
                    backgroundColor: "#2e3035",
                    borderBottom: "1px solid #232326",
                    borderRight: "1px solid #232326",
                    padding: "0 20px",
                    height: "auto",
                    flex: "0 1 55px",
                  }}
                >
                  <Typography
                    sx={{ height: "100%", mt: "15px", color: "white" }}
                    onClick={() => openChat(item.id, usr.id)}
                  >
                    {usr.nickname}
                  </Typography>
                </Box>
              ) : null
            )
          )}
          {dialog?.map((item) =>
            users?.map((usr) =>
              usr.id === item.user_from_id && usr.id != userId ? (
                <Box
                  sx={{
                    backgroundColor: "#2e3035",
                    borderBottom: "1px solid #232326",
                    borderRight: "1px solid #232326",
                    padding: "0 20px",
                    height: "auto",
                    flex: "0 1 55px",
                  }}
                >
                  <Typography
                    sx={{ height: "100%", mt: "15px", color: "white" }}
                    onClick={() => openChat(item.id, usr.id)}
                  >
                    {usr.nickname}
                  </Typography>
                </Box>
              ) : null
            )
          )}
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            backgroundColor: "#E1E1E1",
            height: "810px",
          }}
        >
          {room === 0 ? null : (
            <>
              <Grid
                item
                sx={{
                  position: "relative",
                  boxSizing: "border-box",
                  height: "754px",
                  overflowY: "auto",
                }}
              >
                <Message todo={room} />
              </Grid>
              <Grid item>
                <FormGroup
                  sx={{
                    display: "flex",
                    height: "55px",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    multiline
                    rows={1}
                    placeholder="Написать комментарий"
                    name="message"
                    onChange={changeHandler}
                    sx={{
                      border: "none",
                      outline: "none",
                      reSize: "none",
                      backgroundColor: "#323232",
                      color: "#fff",
                      width: "100%",
                      fontSize: "100%",
                      height: "auto",
                      borderRadius: "0px",

                      ".MuiOutlinedInput-root": {
                        borderRadius: "0px",
                        borderColor: "rgb(0 0 0 / 0%)",
                        color: "white",
                      },
                      ".MuiOutlinedInput-notchedOutline": {
                        borderRadius: "0px",
                        borderColor: "rgb(0 0 0 / 0%)",
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    component="span"
                    color="secondary"
                    onClick={() => sendMessage()}
                    sx={{
                      height: "36px",
                      width: "71px",
                      textAlign: "center",
                      position: "absolute",
                      right: "0",
                      mr: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12px",
                        lineHeight: "12px",
                        textTransform: "capitalize",
                      }}
                    >
                      Отправить
                    </Typography>
                  </Button>
                </FormGroup>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatPage;

//  {
//    message.map((item) =>
//       item.user_from_id == userId ? (<h1>{item.message}</h1>) : (<h3>{item.message}</h3>)
//    )
//}
