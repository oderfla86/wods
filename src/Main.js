import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
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
  const images = require.context("./Images", true);
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

  useEffect(() => {
    app.current = initializeApp(firebaseConfig);
    db.current = getDatabase(app.current);
    getWods();
  }, []);

  async function getWods() {
    wods = ref(db.current, `workouts`);

    let result = await signInAnonymously(getAuth(app.current));
    if (result) {
      console.log("Logged in as:", result.user.uid);

      onValue(wods, (snapshot) => {
        //fires whenever a change occurs
        let wods = snapshot.val();
        console.log(wods);
        setWorkouts(wods);
      });
    }
    //   playerId.current = result.user.uid;
    //   playerRef.current = ref(db.current, `players/${playerId.current}`);
    //   set(playerRef.current, {
    //     name: "dummy",
    //     id: playerId.current,
    //   });
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
              <CardMedia
                component="img"
                height="5"
                image={images(`./bg.png`)}
                alt="Paella dish"
              />
              <CardContent>
                <Typography variant="body1" color="text.primary" align="center">
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
                    Heat oil in a (14- to 16-inch) paella pan or a large, deep
                    skillet over medium-high heat. Add chicken, shrimp and
                    chorizo, and cook, stirring occasionally until lightly
                    browned, 6 to 8 minutes. Transfer shrimp to a large plate
                    and set aside, leaving chicken and chorizo in the pan. Add
                    pimentón, bay leaves, garlic, tomatoes, onion, salt and
                    pepper, and cook, stirring often until thickened and
                    fragrant, about 10 minutes. Add saffron broth and remaining
                    4 1/2 cups chicken broth; bring to a boil.
                  </Typography>
                  <Typography paragraph>
                    Add rice and stir very gently to distribute. Top with
                    artichokes and peppers, and cook without stirring, until
                    most of the liquid is absorbed, 15 to 18 minutes. Reduce
                    heat to medium-low, add reserved shrimp and mussels, tucking
                    them down into the rice, and cook again without stirring,
                    until mussels have opened and rice is just tender, 5 to 7
                    minutes more. (Discard any mussels that don&apos;t open.)
                  </Typography>
                  <Typography>
                    Set aside off of the heat to let rest for 10 minutes, and
                    then serve.
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
