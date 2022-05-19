import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  Fragment,
} from "react";

import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Avatar,
  ButtonGroup,
  styled,
  Modal,
  FormControl,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  inputClasses,
  inputLabelClasses,
  InputBase,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Masonry } from "@mui/lab";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import MainCard from "../../components/PostCard";

function UserPage() {
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const { userId } = useContext(AuthContext);

  const [profile, setProfile] = useState();
  // const [image, setImage] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedProfile, setIsLoadedProfile] = useState(false);
  const [progress, setProgress] = useState(0);

  const [subs, setSubs] = useState();

  const getSubs = useCallback(async () => {
    try {
      await axios
        .get(
          `/api/subscribes/get_subscribes_list/${window.location.pathname.slice(6)}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) =>
          setTimeout(() => {
            setSubs(response.data);
            setIsLoaded(true);
          }, 2000)
        );
    } catch (e) {
      console.log(e);
    }
  });

  const getProfile = useCallback(async () => {
    try {
      await axios
        .get(`/api/auth/get_user`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) =>
          setTimeout(() => {
            setProfile(response.data);
            setIsLoadedProfile(true);
          }, 2000)
        );
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getSubs();
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  let chk = [];

  console.log(subs);

  return !isLoaded
    ? 
    (
       <>
        <h1>1111</h1>
        <h1>1111</h1>
        <h1>1111</h1>
        <h1>1111</h1>
        <h1>1111</h1>
       </>
    )
    : 
    (
       subs.length == 0 ?
       (<>
        <Typography sx={{ color: "white" }}>
            LOH BEZ DRYZEI
        </Typography>
        <Typography sx={{ color: "white" }}>
            LOH BEZ DRYZEI
        </Typography>
        <Typography sx={{ color: "white" }}>
            LOH BEZ DRYZEI
        </Typography>
        <Typography sx={{ color: "white" }}>
            LOH BEZ DRYZEI
        </Typography>
        <Typography sx={{ color: "white" }}>
            LOH BEZ DRYZEI
        </Typography>
        <Typography sx={{ color: "white" }}>
            LOH BEZ DRYZEI
        </Typography>
        <Typography sx={{ color: "white" }}>
            LOH BEZ DRYZEI
        </Typography>
        <Typography sx={{ color: "white" }}>
            LOH BEZ DRYZEI
        </Typography>
       </>) 
       
       : 
       
       (
        subs.map((item) => (
            <>
                <h1>HUI</h1>
              <Typography
                sx={{
                  display: "flex",
                  fontWeight: 400,
                  fontSize: "20px",
                  alignItems: "center",
                  color: "red",
                }}
              >
                {isLoadedProfile ? (
                    profile.map((usr) =>
                    usr.id == item.subscribes_id ? usr.nickname : null
                )
                ) : 
                (
                    <h1>Hui</h1>
                )}
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  fontWeight: 400,
                  fontSize: "20px",
                  alignItems: "center",
                  color: "#8ac8ff",
                }}
              >
                {item.date_publication}
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  fontWeight: 400,
                  fontSize: "16px",
                  alignItems: "center",
                  color: "white",
                }}
              >
                {item.message}
              </Typography>
            </>
          ))
       )
    )
}

export default UserPage;
