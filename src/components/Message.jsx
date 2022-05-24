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
import { saveAs } from "file-saver";

const Message = ({ todo }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [itemss, setItems] = useState([]);
  const [profile, setProfile] = useState([]);
  const [progress, setProgress] = useState(0);
  const [activity, setActivity] = useState();
  const [message, setMessage] = useState();
  const [expanded, setExpanded] = React.useState(false);
  const [files, setFiles] = useState([]);
  const { userId } = useContext(AuthContext);

  const getPost = useCallback(async (room) => {
    try {
      await axios
        .get(`/api/chat/get_message/${room}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setMessage(response.data));
      setIsLoaded(true);
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getPost(todo);
  }, [message]);

  const SaveDocument = (todo) => {
    console.log(todo)
    saveAs("./test.png", "example.png");
  };

  return (
    <Grid item>
      {message?.map((item) =>
        item.dialog_id === todo ? (
          item.user_from_id === userId ? (
            <Box
              sx={{
                width: "auto",
                display: "flex",
                justifyContent: "flex-end",
                my: 1,
              }}
            >
              {item.img != null ? (
                <>
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
                      color: "white",
                      backgroundColor: "#7D90CD",
                    }}
                    src={`${item.img}?fit=cover&auto=format`}
                    alt={item.label}
                  ></Box>
                  <h4>{item.img}</h4>
                  <Button
                    sx={{
                      color: "black",
                    }}
                    onClick={() => SaveDocument(item.img)}
                  >
                    save
                  </Button>
                </>
              ) : null}
              <Typography
                sx={{
                  color: "white",
                  textAlign: "right",
                  width: "fit-content",
                  backgroundColor: "#7D90CD",
                  mr: 3,
                  p: "10px",
                  borderRadius: "15px",
                }}
              >
                {item.message}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: "auto",
                display: "flex",
                justifyContent: "flex-start",
                my: 1,
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  textAlign: "left",
                  ml: 3,
                  backgroundColor: "#71788D",
                  p: "10px",
                  borderRadius: "15px",
                }}
              >
                {item.message}
              </Typography>
            </Box>
          )
        ) : null
      )}
    </Grid>
  );
};

export default Message;
