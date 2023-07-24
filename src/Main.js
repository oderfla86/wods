import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
// import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Main() {
  const [expanded, setExpanded] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  // const images = require.context("./Images", true);
  const firebaseConfig = {
    apiKey: "AIzaSyA0dberbHig8XFSbGVjV86wf_rO5Eo1C7c",
    authDomain: "wods-53f4c.firebaseapp.com",
    projectId: "wods-53f4c",
    storageBucket: "wods-53f4c.appspot.com",
    messagingSenderId: "733051430910",
    appId: "1:733051430910:web:575aa85aec099db64d42af",
  };
  let app = useRef(null);
  let db = useRef(null);
  let wods = useRef(null);
  let user = useRef(null);
  const nameRef = useRef("");
  const surnameRef = useRef("");
  const phoneRef = useRef("");

  useEffect(() => {
    app.current = initializeApp(firebaseConfig);
    db.current = getDatabase(app.current);
    authenticate();
  }, []);

  // function getUid() {
  //   return Math.floor(Math.random() * Date.now()).toString();
  // }

  async function authenticate() {
    const auth = getAuth();
    const authUser = await signInAnonymously(auth);
    if (authUser) {
      console.log("UID value:", authUser.user.uid);
      getWods();
      user.current = {
        uid: authUser.user.uid,
        dbRef: ref(db.current, `users/${authUser.user.uid}`),
      };
      getUserData();
    } else {
      console.error("Unable to authenticate user");
    }
  }

  async function getUserData() {
    get(user.current.dbRef)
      .then((userData) => {
        if (userData.exists()) {
          //user exists so we use its data
          const { id, name, surname, phone, workouts } = userData.val();
          user.current = {
            id,
            name,
            surname,
            phone,
            workouts: JSON.parse(workouts),
          };
          setIsExistingUser(true);
          setIsLoading(false);
        } else {
          //user doesn't exists, needs to login
          setIsLoading(false);
          console.log(`User with id:${user.current.uid} doesn't exist`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getWods() {
    const wodsRef = ref(db.current, `workouts`);
    onValue(wodsRef, (snapshot) => {
      console.info(snapshot.val());
      wods.current = snapshot.val();
      setWorkouts(snapshot.val());
      // const help = snapshot.val().map((item) => {
      //   item.uuid = getUid();
      //   return item;
      // });
      // console.log(JSON.stringify(help));
    });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitUserData = () => {
    setOpen(false);
    set(user.current.dbRef, {
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      phone: phoneRef.current.value,
      id: user.current.uid,
      workouts: JSON.stringify(wods.current),
    });
    setIsExistingUser(true);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  } else {
    if (isExistingUser) {
      return (
        <Grid container spacing={1} justifyContent="center">
          {workouts.map((wod) => {
            const { title, description, workout } = wod;
            return (
              <Grid item>
                <Card sx={{ width: 300 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[900] }} aria-label="recipe">
                        AH
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                    }
                    title={title}
                  />
                  <Divider variant="middle" />
                  <CardContent>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      align="center"
                    >
                      {description}
                    </Typography>
                    {workout.map(function (movement) {
                      if (movement.effort)
                        return (
                          <Typography
                            variant="body1"
                            color="text.primary"
                            align="center"
                          >
                            {movement.effort}
                          </Typography>
                        );
                      return wod.type === "ladder" ? (
                        <Typography
                          variant="body1"
                          color="text.primary"
                          align="center"
                        >
                          {`${movement.type} ${
                            movement.weight ? `@${movement.weight}` : ""
                          }`}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body1"
                          color="text.primary"
                          align="center"
                        >
                          {`${movement.reps} ${movement.type} ${
                            movement.weight ? `@${movement.weight}` : ""
                          }`}
                        </Typography>
                      );
                    })}
                  </CardContent>
                  <CardActions disableSpacing>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph>Method:</Typography>
                      <Typography paragraph>
                        Heat 1/2 cup of the broth in a pot until simmering, add
                        saffron and set aside for 10 minutes.
                      </Typography>
                      <Typography paragraph>
                        Heat oil in a (14- to 16-inch) paella pan or a large,
                        deep skillet over medium-high heat.
                      </Typography>
                      <Typography paragraph>
                        Add rice and stir very gently to distribute.
                      </Typography>
                      <Typography>
                        Set aside off of the heat to let rest for 10 minutes,
                        and then serve.
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      );
    }
    return (
      <div>
        <Typography align="center" sx={{ m: 10 }}>
          <Button
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            onClick={handleClickOpen}
          >
            Login to access the workouts
          </Button>
        </Typography>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To have access to the workouts, please enter your name and email
              address here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              inputRef={nameRef}
            />
            <TextField
              margin="dense"
              id="surname"
              label="Surname"
              type="text"
              fullWidth
              variant="outlined"
              inputRef={surnameRef}
            />
            <TextField
              margin="dense"
              id="name"
              label="Phone"
              type="number"
              fullWidth
              variant="outlined"
              inputRef={phoneRef}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={submitUserData}>Subscribe</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
