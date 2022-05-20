import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMountEffect,
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
  Card,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

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

const MainCard = ({ todo }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [itemss, setItems] = useState([]);
  const [profile, setProfile] = useState([]);
  const [progress, setProgress] = useState(0);
  const [activity, setActivity] = useState();
  const [expanded, setExpanded] = React.useState(false);

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
          }, 2000);
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

  const createActivity = async () => {
    if (userId === null) {
      return;
    } else
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
    if (userId === null) {
      return;
    } else
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

  const checkLike = (post) => {
    let pst = activity.find((i) => i.post_id === post);

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

  return !isLoaded ? (
    <CircularProgress variant="determinate" value={progress} />
  ) : (
    <Grid mt={6}>
      <Container sx={{ maxWidth: "300px", height: "auto" }}>
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
                  <Grid sx={{ ml: "180px", height: "28px", mr: "7px" }}>
                    <Typography
                      sx={{
                        display: "flex",
                        fontWeight: 400,
                        fontSize: "14px",
                        alignItems: "center",
                      }}
                    >
                      {todo.count_watch}

                      <VisibilityIcon
                        sx={{
                          ml: 1,
                        }}
                      />
                    </Typography>
                  </Grid>
                  <Grid
                    sx={{
                      height: "30px",
                      alignItems: "flex-start",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        fontWeight: 500,
                        display: "flex",
                        overflowX: "hidden",
                        width: "180px",
                        height: "30px",
                      }}
                    >
                      <Button
                        onClick={() => checkWatch(todo.id)}
                        sx={{
                          color: "white",
                        }}
                      >
                        {userId === null ? (
                          todo.name
                        ) : (
                          <Link to={`/post/${todo.id}`} style={LinkStyle}>
                            {todo.name}
                          </Link>
                        )}
                      </Button>
                    </Typography>
                    <Grid
                      container
                      sx={{
                        display: "flex",
                        mt: "3px",
                        mr: "10px",
                        width: "auto",
                      }}
                    >
                      <Typography
                        sx={{
                          display: "flex",
                          fontWeight: 400,
                          fontSize: "15px",
                          alignItems: "center",
                        }}
                      >
                        {todo.count_comments}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          fontWeight: 400,
                          fontSize: "15px",
                          alignItems: "center",
                          ml: "7px",
                        }}
                      >
                        <ChatBubbleOutlineIcon />
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid
                    sx={{
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {userId === null ? (
                      <Avatar
                      component="a"
                      variant="span"
                     
                      alt="logo"
                      src={`${
                        profile.find((item) => item.id === todo.user_id).avatar
                      }`}
                      sx={{
                        display: "inline-block",
                        width: 30,
                        height: 30,
                        mr: 1,
                        ml: "10px",
                      }}
                    />
                    ) : (
                      <Avatar
                      component="a"
                      variant="span"
                      href={`/user/${todo.user_id}`}
                      alt="logo"
                      src={`${
                        profile.find((item) => item.id === todo.user_id).avatar
                      }`}
                      sx={{
                        display: "inline-block",
                        width: 30,
                        height: 30,
                        mr: 1,
                        ml: "10px",
                      }}
                    />
                    )}
                    
                    <Typography
                      noWrap
                      sx={{
                        display: "inline-block",
                        fontWeight: 300,
                        fontSize: "15px",
                      }}
                    >
                      {
                        
                        profile.find((item) => item.id === todo.user_id)
                          .nickname
                      }
                    </Typography>
                  </Grid>
                  <Grid
                    sx={{
                      mr: 1,
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        fontWeight: 400,
                        fontSize: "15px",
                        alignItems: "center",
                      }}
                    >
                      {todo.count_like}
                    </Typography>
                    <Button
                      onClick={() => checkLike(todo.id)}
                      sx={{
                        display: "flex",
                        width: "25px",
                        minWidth: "25px",
                        height: "30px",
                        color: "white",
                        ml: "7px",
                        mr: "1px",
                      }}
                    >
                      <FavoriteBorderIcon />
                    </Button>

                    {/* <Button onClick={() => checkLike(todo.id)}>Like</Button>
                      <Button onClick={() => checkWatch(todo.id)}>Watch</Button> */}
                  </Grid>
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
      </Container>
    </Grid>
  );
};

export default MainCard;
